export interface GalleryImage {
  id: string;
  title: string;
  image: string;
  link: string; // URL to full-size image or external link
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryVideo {
  id: string;
  title: string;
  thumbnail: string;
  link: string; // URL to video (e.g., YouTube, Vimeo)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGalleryImageInput {
  title: string;
  image: string;
  link: string;
  isActive: boolean;
}

export interface CreateGalleryVideoInput {
  title: string;
  thumbnail: string;
  link: string;
  isActive: boolean;
}
