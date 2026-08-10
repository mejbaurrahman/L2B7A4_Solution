export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  image?: string;
  address?: string;
  city?: string;
}
