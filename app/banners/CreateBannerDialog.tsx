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
import { CreateBannerInput } from "@/types/banner";
import { ImagePreview } from "@/components/ui/image-preview";
import { Switch } from "@/components/ui/switch";
import { StatusToggle } from "@/components/ui/status-toggle";

interface CreateBannerDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateBannerDialog({
  open,
  onClose,
  onSuccess,
}: CreateBannerDialogProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<CreateBannerInput>({
    title: "",
    image: "",
    link: "",
    isActive: true,
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
    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file:", file.name);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload response not ok:", response.status, errorText);
        throw new Error(`Upload failed: ${errorText}`);
      }

      const data = await response.json();
      console.log("Upload response:", data);

      if (!data.success || !data.url) {
        console.error("Invalid upload response:", data);
        throw new Error(data.error || "Invalid upload response");
      }

      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    }
  };

  const createBanner = async (bannerData: {
    title: string;
    image: string;
    link: string;
    isActive: boolean;
  }) => {
    console.log("Sending banner data:", JSON.stringify(bannerData, null, 2));

    const response = await fetch("/api/banners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bannerData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create banner");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to create banner");
    }

    return data;
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
      const imageUrl = await uploadImage(selectedFile);
      console.log("Image uploaded successfully:", imageUrl);

      // 2. Create banner with the image URL
      const bannerData = {
        title: formData.title.trim(),
        image: imageUrl.trim(),
        link: formData.link.trim(),
        isActive: formData.isActive,
      };

      console.log("Creating banner with data:", bannerData);
      const result = await createBanner(bannerData);
      console.log("Banner created successfully:", result);

      // 3. Success handling
      onSuccess();
      resetForm();
    } catch (error) {
      console.error("Form submission error:", error);
      alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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
          <DialogTitle>Create New Banner</DialogTitle>
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
              placeholder="Enter link (e.g., YouTube URL)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Upload Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
              required
            />
          </div>

          {preview && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <ImagePreview
                src={preview}
                alt={formData.title || "Preview"}
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
              {loading ? "Creating..." : "Create Banner"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
