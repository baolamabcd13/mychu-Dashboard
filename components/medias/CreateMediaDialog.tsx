"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateMediaInput } from "@/types/media";
import { ImagePreview } from "@/components/ui/image-preview";
import { StatusToggle } from "@/components/ui/status-toggle";

interface CreateMediaDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateMediaDialog({
  open,
  onClose,
  onSuccess,
}: CreateMediaDialogProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<CreateMediaInput>({
    title: "",
    image: "",
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      image: "",
      isActive: true,
    });
    setPreview("");
    setSelectedFile(null);
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    if (!data.success || !data.url) {
      throw new Error(data.error || "Invalid upload response");
    }

    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!selectedFile) {
        throw new Error("Please select an image");
      }

      // 1. Upload image first
      console.log("Starting image upload...");
      try {
        const imageUrl = await uploadImage(selectedFile);
        console.log("Image uploaded successfully:", imageUrl);

        // 2. Create media with the image URL
        const mediaData = {
          title: formData.title.trim(),
          image: imageUrl,
          isActive: formData.isActive,
        };
        console.log("Sending media data:", mediaData);

        const response = await fetch("/api/medias", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mediaData),
        });

        // Log the raw response
        const responseText = await response.text();
        console.log("Raw API Response:", responseText);

        // Parse the response
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          throw new Error("Invalid response format");
        }

        if (!response.ok) {
          throw new Error(data.error || "Failed to create media");
        }

        if (!data.success) {
          throw new Error(data.error || "Operation failed");
        }

        console.log("Media created successfully:", data);
        onSuccess();
        resetForm();
      } catch (uploadError) {
        console.error("Error during image upload:", uploadError);
        throw new Error(
          uploadError instanceof Error
            ? uploadError.message
            : "Failed to upload image"
        );
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
        }
        onClose();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Media</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter media title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="cursor-pointer"
            />
          </div>

          {preview && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <ImagePreview
                src={preview}
                alt="Preview"
                onRemove={() => {
                  setPreview("");
                  setSelectedFile(null);
                  const fileInput = document.getElementById(
                    "image"
                  ) as HTMLInputElement;
                  if (fileInput) {
                    fileInput.value = "";
                  }
                }}
              />
            </div>
          )}

          <StatusToggle
            isActive={formData.isActive}
            onToggle={(checked) =>
              setFormData({ ...formData, isActive: checked })
            }
          />

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                onClose();
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Media"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
