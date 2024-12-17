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
import { CreateGalleryImageInput } from "@/types/gallery";
import { ImagePreview } from "@/components/ui/image-preview";
import { StatusToggle } from "@/components/ui/status-toggle";

interface CreateGalleryImageDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateGalleryImageDialog({
  open,
  onClose,
  onSuccess,
}: CreateGalleryImageDialogProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<CreateGalleryImageInput>({
    title: "",
    image: "",
    link: "",
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      image: "",
      link: "",
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

      // Upload image first
      const imageUrl = await uploadImage(selectedFile);

      // Create gallery image with the uploaded image URL
      const response = await fetch("/api/gallery/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create gallery image");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Operation failed");
      }

      onSuccess();
      resetForm();
    } catch (error) {
      console.error("Error creating gallery image:", error);
      alert(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Gallery Image</DialogTitle>
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
              placeholder="Enter image title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              placeholder="Enter image link"
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
              {loading ? "Creating..." : "Create Image"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
