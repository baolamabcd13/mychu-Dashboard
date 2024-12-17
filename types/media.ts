export interface Media {
  id: string;
  title: string;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMediaInput {
  title: string;
  image: string;
  isActive: boolean;
}
