export interface Banner {
  id: string;
  title: string;
  image: string;
  link: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBannerInput {
  title: string;
  image: string;
  link: string;
  isActive: boolean;
}

export interface UpdateBannerInput {
  title?: string;
  image?: string;
  link?: string;
  isActive?: boolean;
}

export interface BannerResponse {
  success: boolean;
  message: string;
  data?: Banner | Banner[];
  error?: string;
}
