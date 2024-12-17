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
import { GalleryVideo } from "@/types/gallery";
import { StatusToggle } from "@/components/ui/status-toggle";
import { ImagePreview } from "@/components/ui/image-preview";

interface EditGalleryVideoDialogProps {
  video: GalleryVideo;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditGalleryVideoDialog({
  video,
  open,
  onClose,
  onSuccess,
}: EditGalleryVideoDialogProps) {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(video.thumbnail);
  const [formData, setFormData] = useState({
    title: video.title,
    thumbnail: video.thumbnail,
    link: video.link,
    isActive: video.isActive,
  });

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
      let thumbnailUrl = formData.thumbnail;

      // Upload new thumbnail if selected
      if (selectedFile) {
        thumbnailUrl = await uploadImage(selectedFile);
      }

      const response = await fetch(`/api/gallery/videos/${video.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          thumbnail: thumbnailUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update gallery video");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Operation failed");
      }

      onSuccess();
    } catch (error) {
      console.error("Error updating gallery video:", error);
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
          <DialogTitle>Edit Gallery Video</DialogTitle>
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
              className="cursor-pointer"
            />
          </div>

          {preview && (
            <div className="space-y-2">
              <Label>Current Thumbnail</Label>
              <ImagePreview
                src={preview}
                alt={formData.title}
                onRemove={() => {
                  setPreview(video.thumbnail);
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
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
