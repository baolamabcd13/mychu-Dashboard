import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch gallery images",
        data: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.image || !body.link) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const image = await prisma.galleryImage.create({
      data: {
        title: body.title,
        image: body.image,
        link: body.link,
        isActive: body.isActive === undefined ? true : body.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error("Error creating gallery image:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create gallery image",
      },
      { status: 500 }
    );
  }
}
