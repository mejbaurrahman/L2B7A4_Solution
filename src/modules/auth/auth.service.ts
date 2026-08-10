import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ICreateUser } from "./auth.interface";
import config from "../../config";

const registerIntoDB = async (payload: ICreateUser) => {
  const { name, email, password, phone, image, address, city } = payload;

  const isUserExist = await prisma.user.findUnique({ where: { email } });
  if (isUserExist) {
    throw new Error("User with this email already exists");
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      ...(phone !== undefined && { phone }),
      ...(image !== undefined && { image }),
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
    },
  });

  console.log(createdUser);
  const { password: _, ...userWithoutPassword } = createdUser;

  return userWithoutPassword;
};

export const authService = {
  registerIntoDB,
};
