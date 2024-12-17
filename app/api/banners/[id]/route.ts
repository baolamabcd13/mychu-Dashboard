import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const banner = await prisma.banner.update({
      where: {
        id: params.id,
      },
      data: {
        title: body.title,
        image: body.image,
        link: body.link,
        isActive: body.isActive,
      },
    });

    return NextResponse.json({ success: true, data: banner });
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Deleting banner with ID:", params.id);

    const banner = await prisma.banner.delete({
      where: {
        id: params.id,
      },
    });

    console.log("Banner deleted:", banner);

    return NextResponse.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete banner",
      },
      { status: 500 }
    );
  }
}
