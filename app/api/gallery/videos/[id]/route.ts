import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.galleryVideo.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Gallery video deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting gallery video:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete gallery video",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const video = await prisma.galleryVideo.update({
      where: {
        id: params.id,
      },
      data: {
        title: body.title,
        thumbnail: body.thumbnail,
        link: body.link,
        isActive: body.isActive,
      },
    });

    return NextResponse.json({ success: true, data: video });
  } catch (error) {
    console.error("Error updating gallery video:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update gallery video" },
      { status: 500 }
    );
  }
}
