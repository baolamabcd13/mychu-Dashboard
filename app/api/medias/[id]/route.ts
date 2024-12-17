import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Deleting media with ID:", params.id);

    const media = await prisma.media.delete({
      where: {
        id: params.id,
      },
    });

    console.log("Media deleted:", media);

    return NextResponse.json({
      success: true,
      message: "Media deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete media",
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
    const media = await prisma.media.update({
      where: {
        id: params.id,
      },
      data: {
        title: body.title,
        image: body.image,
        isActive: body.isActive,
      },
    });

    return NextResponse.json({ success: true, data: media });
  } catch (error) {
    console.error("Error updating media:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update media" },
      { status: 500 }
    );
  }
}
