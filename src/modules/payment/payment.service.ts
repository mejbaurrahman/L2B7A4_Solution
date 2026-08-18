import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { ICreatePayment } from "./payment.interface";

const createPayment = async (userId: string, payload: ICreatePayment) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: payload.bookingId,
      customerId: userId,
    },
    include: {
      customer: true,
      service: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status !== "ACCEPTED") {
    throw new Error("Payment is only available for accepted bookings");
  }

  const existingPayment = await prisma.payment.findUnique({
    where: {
      bookingId: booking.id,
    },
  });

  if (existingPayment && existingPayment.status === "COMPLETED") {
    throw new Error("This booking has already been paid");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: booking.customer.email,
    line_items: [
      {
        price_data: {
          currency: "bdt",

          product_data: {
            name: booking.service.title,
          },
          unit_amount: Math.round(booking.totalAmount),
        },

        quantity: 1,
      },
    ],
    success_url: process.env.STRIPE_SUCCESS_URL!,

    cancel_url: process.env.STRIPE_CANCEL_URL!,
    metadata: {
      bookingId: booking.id,
      customerId: booking.customerId,
    },
    client_reference_id: booking.id,
  });

  await prisma.payment.upsert({
    where: {
      bookingId: booking.id,
    },

    update: {
      transactionId: session.id,
      stripeSessionId: session.id,
      amount: booking.totalAmount,
      status: "PENDING",
    },

    create: {
      bookingId: booking.id,
      transactionId: session.id,
      stripeSessionId: session.id,
      amount: booking.totalAmount,
      status: "PENDING",
    },
  });

  return {
    sessionId: session.id,
    paymentUrl: session.url,
  };
};

const confirmPayment = async (rawBody: Buffer, signature: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    throw new Error("Invalid Stripe webhook signature");
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      throw new Error("Booking ID not found in Stripe metadata");
    }

    /**
     * Find our local payment
     */
    const payment = await prisma.payment.findUnique({
      where: {
        bookingId,
      },
    });

    if (!payment) {
      throw new Error("Payment record not found");
    }

    /**
     * Prevent duplicate processing.
     *
     * Stripe can send webhook events
     * more than once.
     */
    if (payment.status === "COMPLETED") {
      return {
        received: true,
        message: "Payment already completed",
      };
    }

    /**
     * Get PaymentIntent ID
     */
    const paymentIntent = session.payment_intent;

    /**
     * Update payment
     */
    await prisma.payment.update({
      where: {
        bookingId: bookingId,
      },

      data: {
        status: "COMPLETED",
        paidAt: new Date(),

        stripeSessionId: session.id,

        stripePaymentIntentId:
          typeof paymentIntent === "string" ? paymentIntent : null,

        transactionId: session.id,
      },
    });
  }

  return {
    received: true,
  };
};

/**
 * Get logged-in customer's payment history
 */
const getPayments = async (userId: string) => {
  const payments = await prisma.payment.findMany({
    where: {
      booking: {
        customerId: userId,
      },
    },

    include: {
      booking: {
        include: {
          service: true,

          technician: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },

          availability: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return payments;
};

/**
 * Get one payment
 */
const getPaymentById = async (userId: string, paymentId: string) => {
  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,

      /**
       * Make sure payment belongs
       * to logged-in customer.
       */
      booking: {
        customerId: userId,
      },
    },

    include: {
      booking: {
        include: {
          service: true,

          technician: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },

          availability: true,
        },
      },
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
};

export const paymentService = {
  createPayment,
  confirmPayment,
  getPayments,
  getPaymentById,
};
