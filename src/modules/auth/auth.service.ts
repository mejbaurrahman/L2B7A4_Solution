import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ICreateUser, ILoggedInInterface } from "./auth.interface";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { JwtPayload, SignOptions } from "jsonwebtoken";

const registerIntoDB = async (payload: ICreateUser) => {
  const {
    name,
    email,
    password,
    phone,
    image,
    address,
    city,
    role,
    bio,
    experience,
    hourlyRate,
    location,
  } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExist) {
    throw new Error("User with this email already exists");
  }

  if (role === "TECHNICIAN") {
    if (
      experience === undefined ||
      hourlyRate === undefined ||
      location === undefined
    ) {
      throw new Error(
        "Experience, hourlyRate and location are required for technician",
      );
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const userData: any = {
    name,
    email,
    password: hashedPassword,
    role,

    ...(phone !== undefined && { phone }),
    ...(image !== undefined && { image }),
    ...(address !== undefined && { address }),
    ...(city !== undefined && { city }),
  };

  if (role === "TECHNICIAN") {
    userData.technicianProfile = {
      create: {
        bio,
        experience,
        hourlyRate,
        location,
      },
    };
  }

  const createdUser = await prisma.user.create({
    data: userData,

    include: {
      technicianProfile: true,
    },
  });

  // Remove password
  const { password: _, ...userWithoutPassword } = createdUser;

  return userWithoutPassword;
};
const loginUser = async (payload: ILoggedInInterface) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  if (user.status === "BAN") {
    throw new Error("Your account has been banned. Please contact support.");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );
  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    config.jwt_refresh_secret,
  );

  if (!verifiedRefreshToken.success) {
    throw new Error(verifiedRefreshToken.error);
  }

  console.log(verifiedRefreshToken);
  const { id } = verifiedRefreshToken.data as JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (user.status === "BAN") {
    throw new Error("User is banned!");
  }

  const jwtPayload = {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  return { accessToken };
};

const getMyProfileFromDB = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
    omit: {
      password: true,
    },
  });

  return user;
};

export const authService = {
  registerIntoDB,
  loginUser,
  refreshToken,
  getMyProfileFromDB,
};
