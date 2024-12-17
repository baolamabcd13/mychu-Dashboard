import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    console.log("[GET /api/medias] Starting...");

    // Kiểm tra kết nối Prisma
    try {
      await prisma.$connect();
      console.log("[GET /api/medias] Database connected successfully");
    } catch (dbError) {
      console.error("[GET /api/medias] Database connection error:", dbError);
      throw new Error("Database connection failed");
    }

    // Thử query đơn giản trước
    try {
      const count = await prisma.media.count();
      console.log("[GET /api/medias] Media count:", count);
    } catch (countError) {
      console.error("[GET /api/medias] Count query error:", countError);
      throw new Error("Database query failed");
    }

    // Fetch medias
    const medias = await prisma.media.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("[GET /api/medias] Fetched medias count:", medias.length);

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: medias,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("[GET /api/medias] Error:", error);

    return new NextResponse(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        data: [],
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } finally {
    // Đảm bảo ngắt kết nối
    try {
      await prisma.$disconnect();
      console.log("[GET /api/medias] Database disconnected");
    } catch (disconnectError) {
      console.error("[GET /api/medias] Error disconnecting:", disconnectError);
    }
  }
}

export async function POST(request: Request) {
  try {
    console.log("[POST /api/medias] Starting...");

    const body = await request.json();
    console.log("[POST /api/medias] Request body:", body);

    if (!body.title || !body.image) {
      console.log("[POST /api/medias] Missing required fields");
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Missing required fields",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const media = await prisma.media.create({
      data: {
        title: body.title,
        image: body.image,
        isActive: body.isActive === undefined ? true : body.isActive,
      },
    });

    console.log("[POST /api/medias] Created media:", media);

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: media,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("[POST /api/medias] Error:", error);

    return new NextResponse(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create media",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
