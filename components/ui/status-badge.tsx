interface StatusBadgeProps {
  isActive: boolean;
  className?: string;
}

export function StatusBadge({ isActive, className = "" }: StatusBadgeProps) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-sm font-medium ${
        isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      } ${className}`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
