import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Play, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { Button } from "../common/Button";
import type { PlaylistItem as PlaylistItemType } from "../../types/playlist";

interface PlaylistItemProps {
  item: PlaylistItemType;
  isCurrent: boolean;
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
}

export function PlaylistItem({ isCurrent, item, onRemove, onSelect }: PlaylistItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <li
      className={[
        "flex items-center gap-3 rounded-lg border p-2 transition",
        isCurrent
          ? "border-loop-primary bg-loop-primary/10"
          : "border-white/10 bg-black/20 hover:bg-white/[0.06]"
      ]
        .filter(Boolean)
        .join(" ")}
      ref={setNodeRef}
      style={style}
    >
      <button
        aria-label="순서 변경"
        className="flex h-9 w-7 cursor-grab items-center justify-center text-loop-muted active:cursor-grabbing"
        type="button"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>
      <img alt="" className="h-12 w-20 rounded object-cover" src={item.thumbnailUrl} />
      <button
        className="min-w-0 flex-1 text-left"
        onClick={() => onSelect(item.id)}
        type="button"
      >
        <p className="truncate text-sm font-medium">{item.title ?? item.videoId}</p>
        <p className="truncate text-xs text-loop-muted">{item.videoId}</p>
      </button>
      {isCurrent ? (
        <span className="flex h-8 w-8 items-center justify-center text-loop-primary">
          <Play size={16} />
        </span>
      ) : null}
      <Button
        aria-label="삭제"
        onClick={() => onRemove(item.id)}
        size="icon"
        variant="ghost"
      >
        <Trash2 size={17} />
      </Button>
    </li>
  );
}
