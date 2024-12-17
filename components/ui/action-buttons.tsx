import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react"; // Import icons

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

export function ActionButtons({
  onEdit,
  onDelete,
  className = "",
}: ActionButtonsProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this item?")) {
      onDelete();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        onClick={handleDelete}
        variant="destructive"
        size="sm"
        className="h-8 w-8 p-0"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
