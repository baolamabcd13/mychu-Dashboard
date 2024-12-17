import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface StatusToggleProps {
  isActive: boolean;
  onToggle: (value: boolean) => void;
  className?: string;
}

export function StatusToggle({
  isActive,
  onToggle,
  className = "",
}: StatusToggleProps) {
  return (
    <div className={`flex items-center justify-between space-x-2 ${className}`}>
      <Label htmlFor="isActive">Status</Label>
      <div className="flex items-center space-x-2">
        <Label htmlFor="isActive" className="text-sm text-gray-500">
          {isActive ? "Active" : "Inactive"}
        </Label>
        <Switch id="isActive" checked={isActive} onCheckedChange={onToggle} />
      </div>
    </div>
  );
}
