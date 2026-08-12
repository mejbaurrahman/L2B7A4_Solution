export interface ICreateService {
  title: string;
  description: string;
  price: number;
  duration: number;
  categoryId: string;
}

export interface IService {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  technicianId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}
