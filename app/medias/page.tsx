"use client";
import { useEffect, useState } from "react";
import { Media } from "@/types/media";
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
import { ActionButtons } from "@/components/ui/action-buttons";
import { StatusBadge } from "@/components/ui/status-badge";
import CreateMediaDialog from "./CreateMediaDialog";
import EditMediaDialog from "./EditMediaDialog";

export default function MediasPage() {
  const [medias, setMedias] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);

  useEffect(() => {
    fetchMedias();
  }, []);

  const fetchMedias = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching medias...");
      const response = await fetch("/api/medias");

      if (!response.ok) {
        console.error("API Error:", response.status, response.statusText);
        const errorText = await response.text();
        console.error("Error details:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log("Raw response:", text);

      try {
        const data = JSON.parse(text);
        console.log("Parsed data:", data);

        if (data.success) {
          setMedias(data.data || []);
        } else {
          console.error("API returned error:", data.error);
          setMedias([]);
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        setMedias([]);
      }
    } catch (error) {
      console.error("Error fetching medias:", error);
      setMedias([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log("Deleting media:", id);
      const response = await fetch(`/api/medias/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Delete response:", data);

      if (data.success) {
        console.log("Media deleted successfully");
        fetchMedias();
      } else {
        throw new Error(data.error || "Failed to delete media");
      }
    } catch (error) {
      console.error("Error deleting media:", error);
      alert("Failed to delete media");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Media Management</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Media
        </Button>
      </div>

      {medias.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No media items found</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medias.map((media) => (
              <TableRow key={media.id}>
                <TableCell>
                  <Image
                    src={media.image}
                    alt={media.title}
                    width={100}
                    height={60}
                    className="object-cover rounded"
                  />
                </TableCell>
                <TableCell>{media.title}</TableCell>
                <TableCell>
                  <StatusBadge isActive={media.isActive} />
                </TableCell>
                <TableCell>
                  <ActionButtons
                    onEdit={() => setEditingMedia(media)}
                    onDelete={() => handleDelete(media.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <CreateMediaDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => {
          setIsCreateDialogOpen(false);
          fetchMedias();
        }}
      />

      {editingMedia && (
        <EditMediaDialog
          media={editingMedia}
          open={!!editingMedia}
          onClose={() => setEditingMedia(null)}
          onSuccess={() => {
            setEditingMedia(null);
            fetchMedias();
          }}
        />
      )}
    </div>
  );
}
