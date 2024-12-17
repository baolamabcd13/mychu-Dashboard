"use client";
import { useEffect, useState } from "react";
import { Banner } from "@/types/banner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import Image from "next/image";
import CreateBannerDialog from "./CreateBannerDialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionButtons } from "@/components/ui/action-buttons";
import EditBannerDialog from "./EditBannerDialog";

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      console.log("Fetching banners...");
      const response = await fetch("/api/banners");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log("Raw response:", text);

      if (!text) {
        console.log("Empty response received");
        setBanners([]);
        return;
      }

      try {
        const data = JSON.parse(text);
        console.log("Parsed data:", data);

        if (data.success) {
          setBanners(data.data || []);
        } else {
          console.error("API returned error:", data.error);
          setBanners([]);
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        setBanners([]);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      setBanners([]);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      try {
        const response = await fetch(`/api/banners/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (data.success) {
          fetchBanners();
        }
      } catch (error) {
        console.error("Error deleting banner:", error);
      }
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Banner Management</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Banner
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell>
                <Image
                  src={banner.image}
                  alt={banner.title}
                  width={100}
                  height={60}
                  className="object-cover rounded"
                />
              </TableCell>
              <TableCell>{banner.title}</TableCell>
              <TableCell>
                <a
                  href={banner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {banner.link}
                </a>
              </TableCell>
              <TableCell>
                <StatusBadge isActive={banner.isActive} />
              </TableCell>
              <TableCell>
                <ActionButtons
                  onEdit={() => handleEdit(banner)}
                  onDelete={() => handleDelete(banner.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CreateBannerDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => {
          setIsCreateDialogOpen(false);
          fetchBanners();
        }}
      />

      {editingBanner && (
        <EditBannerDialog
          banner={editingBanner}
          open={!!editingBanner}
          onClose={() => setEditingBanner(null)}
          onSuccess={() => {
            setEditingBanner(null);
            fetchBanners();
          }}
        />
      )}
    </div>
  );
}
