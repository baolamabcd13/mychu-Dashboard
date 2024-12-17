import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { mkdir } from "fs/promises";

export async function POST(request: Request) {
  try {
    // Kiểm tra request
    if (!request.body) {
      return NextResponse.json(
        { success: false, error: "Empty request body" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    // Validate file
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "No file or invalid file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "File must be an image" },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    // Create safe filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "");
    const uniqueFileName = `${timestamp}-${originalName}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file
    await writeFile(filePath, buffer);

    // Return success response
    return NextResponse.json({
      success: true,
      url: `/uploads/${uniqueFileName}`,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload file",
      },
      { status: 500 }
    );
  }
}

// Disable body parser
export const config = {
  api: {
    bodyParser: false,
  },
};
