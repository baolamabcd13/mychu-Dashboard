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
import { Banner } from "@/types/banner";
import { StatusToggle } from "@/components/ui/status-toggle";
import { ImagePreview } from "@/components/ui/image-preview";

interface EditBannerDialogProps {
  banner: Banner;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBannerDialog({
  banner,
  open,
  onClose,
  onSuccess,
}: EditBannerDialogProps) {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(banner.image);
  const [formData, setFormData] = useState({
    title: banner.title,
    image: banner.image,
    link: banner.link,
    isActive: banner.isActive,
  });

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
      let imageUrl = formData.image;

      // Upload new image if selected
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const response = await fetch(`/api/banners/${banner.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update banner");
      }

      const data = await response.json();
      if (data.success) {
        onSuccess();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error updating banner:", error);
      alert(error instanceof Error ? error.message : "Failed to update banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Banner</DialogTitle>
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
              placeholder="Enter banner title"
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
              placeholder="Enter link"
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
              className="cursor-pointer"
            />
          </div>

          {preview && (
            <div className="space-y-2">
              <Label>Current Image</Label>
              <ImagePreview
                src={preview}
                alt={formData.title}
                onRemove={() => {
                  setPreview(banner.image);
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