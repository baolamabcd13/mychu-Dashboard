import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const videos = await prisma.galleryVideo.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: videos,
    });
  } catch (error) {
    console.error("Error fetching gallery videos:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch gallery videos",
        data: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.thumbnail || !body.link) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const video = await prisma.galleryVideo.create({
      data: {
        title: body.title,
        thumbnail: body.thumbnail,
        link: body.link,
        isActive: body.isActive === undefined ? true : body.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      data: video,
    });
  } catch (error) {
    console.error("Error creating gallery video:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create gallery video",
      },
      { status: 500 }
    );
  }
}
