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
import { CreateGalleryVideoInput } from "@/types/gallery";
import { ImagePreview } from "@/components/ui/image-preview";
import { StatusToggle } from "@/components/ui/status-toggle";

interface CreateGalleryVideoDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateGalleryVideoDialog({
  open,
  onClose,
  onSuccess,
}: CreateGalleryVideoDialogProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<CreateGalleryVideoInput>({
    title: "",
    thumbnail: "",
    link: "",
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      thumbnail: "",
      link: "",
      isActive: true,
    });
    setPreview("");
    setSelectedFile(null);
    const fileInput = document.getElementById("thumbnail") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      throw new Error("Failed to upload thumbnail");
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
        throw new Error("Please select a thumbnail image");
      }

      // Upload thumbnail first
      const thumbnailUrl = await uploadImage(selectedFile);

      // Create gallery video with the uploaded thumbnail URL
      const response = await fetch("/api/gallery/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          thumbnail: thumbnailUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create gallery video");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Operation failed");
      }

      onSuccess();
      resetForm();
    } catch (error) {
      console.error("Error creating gallery video:", error);
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
          <DialogTitle>Add New Gallery Video</DialogTitle>
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
              placeholder="Enter video title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Video Link</Label>
            <Input
              id="link"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              placeholder="Enter video link (YouTube/Vimeo)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail</Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
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
                    "thumbnail"
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
              {loading ? "Creating..." : "Create Video"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
