import prisma from "@/lib/prisma";
import { Banner, CreateBannerInput } from "@/types/banner";

export const getAllBanners = async () => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return banners;
  } catch (error) {
    console.error("Error getting banners:", error);
    throw error;
  }
};

export const getBannerById = async (id: string) => {
  try {
    const banner = await prisma.banner.findUnique({
      where: { id },
    });
    return banner;
  } catch (error) {
    console.error("Error getting banner:", error);
    throw error;
  }
};

export const createBanner = async (data: {
  title: string;
  image: string;
  link: string;
  isActive: boolean;
}) => {
  console.log("Creating banner with data:", JSON.stringify(data, null, 2));

  try {
    // Validate data
    if (!data.title || !data.image || !data.link) {
      throw new Error("Missing required fields");
    }

    // Create banner
    const banner = await prisma.banner.create({
      data: {
        title: data.title,
        image: data.image,
        link: data.link,
        isActive: data.isActive,
      },
    });

    console.log("Banner created successfully:", banner);
    return banner;
  } catch (error) {
    console.error("Error in createBanner:", error);
    throw error;
  }
};

export const updateBanner = async (id: string, data: Partial<Banner>) => {
  try {
    const banner = await prisma.banner.update({
      where: { id },
      data,
    });
    return banner;
  } catch (error) {
    console.error("Error updating banner:", error);
    throw error;
  }
};

export const deleteBanner = async (id: string) => {
  try {
    const banner = await prisma.banner.delete({
      where: { id },
    });
    return banner;
  } catch (error) {
    console.error("Error deleting banner:", error);
    throw error;
  }
};
