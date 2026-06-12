import { Pencil, Trash2 } from "lucide-react";

export const inp =
  "w-full border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-medical";

export function ActionBtn({
  onClick,
  label,
  variant = "default",
}: {
  onClick: () => void;
  label: string;
  variant?: "default" | "danger" | "success";
}) {
  const cls =
    variant === "danger"
      ? "text-destructive hover:bg-destructive/10"
      : variant === "success"
        ? "text-emerald-brand hover:bg-emerald-brand/10"
        : "text-medical hover:bg-medical/10";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs px-2 py-1 rounded border border-border ${cls}`}
    >
      {label}
    </button>
  );
}

export function RowActions({ onEdit, onDelete }: { onEdit?: () => void; onDelete: () => void }) {
  return (
    <div className="flex gap-1 shrink-0">
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="p-2 text-medical hover:bg-medical/10 rounded"
          title="Edit"
        >
          <Pencil className="size-4" />
        </button>
      )}
      <button
        type="button"
        onClick={onDelete}
        className="p-2 text-destructive hover:bg-destructive/10 rounded"
        title="Delete"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
      {message}
    </div>
  );
}
