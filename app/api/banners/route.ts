import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received request body:", body);

    // Validate required fields
    if (!body.title || !body.image || !body.link) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Create banner with explicit isActive value
    const banner = await prisma.banner.create({
      data: {
        title: body.title,
        image: body.image,
        link: body.link,
        isActive: body.isActive === undefined ? true : body.isActive,
      },
    });

    console.log("Banner created:", banner);

    return NextResponse.json({
      success: true,
      data: banner,
    });
  } catch (error) {
    console.error("Error creating banner:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create banner",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log("Fetching banners...");
    const banners = await prisma.banner.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("Banners fetched:", banners);

    return NextResponse.json({
      success: true,
      data: banners || [], // Đảm bảo luôn trả về array, ngay cả khi rỗng
    });
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch banners",
        data: [],
      },
      { status: 500 }
    );
  }
}
