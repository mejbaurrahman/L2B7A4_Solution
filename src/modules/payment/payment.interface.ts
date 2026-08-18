export interface ICreatePayment {
  bookingId: string;
}

export interface IPaymentResponse {
  sessionId: string;
  paymentUrl: string | null;
}
