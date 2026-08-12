import { Role } from "../../../prisma/generated/prisma/enums";

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  image?: string;
  address?: string;
  city?: string;
  role?: Role;
  bio?: string;
  experience?: number;
  hourlyRate?: number;
  location?: string;
}
export interface IUpdateUser {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  image?: string;
  address?: string;
  city?: string;
  role?: Role;
  bio?: string;
  experience?: number;
  hourlyRate?: number;
  location?: string;
}

export interface ILoggedInInterface {
  email: string;
  password: string;
}
