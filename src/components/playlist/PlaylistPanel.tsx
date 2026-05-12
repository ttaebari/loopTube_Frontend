import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { Trash2 } from "lucide-react";
import { Button } from "../common/Button";
import { AddLinkForm } from "./AddLinkForm";
import { EmptyPlaylist } from "./EmptyPlaylist";
import { PlaylistItem } from "./PlaylistItem";
import { usePlaylistStore } from "../../stores/playlistStore";

export function PlaylistPanel() {
  const items = usePlaylistStore((state) => state.items);
  const currentIndex = usePlaylistStore((state) => state.currentIndex);
  const clearItems = usePlaylistStore((state) => state.clearItems);
  const removeItem = usePlaylistStore((state) => state.removeItem);
  const reorderItems = usePlaylistStore((state) => state.reorderItems);
  const setCurrentIndex = usePlaylistStore((state) => state.setCurrentIndex);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = items.findIndex((item) => item.id === active.id);
    const toIndex = items.findIndex((item) => item.id === over.id);
    reorderItems(fromIndex, toIndex);
  }

  return (
    <aside className="flex min-h-[520px] flex-col gap-4 rounded-lg border border-white/10 bg-loop-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Loop List</h2>
          <p className="text-sm text-loop-muted">{items.length}개 영상</p>
        </div>
        <Button
          aria-label="전체 삭제"
          disabled={items.length === 0}
          onClick={clearItems}
          size="icon"
          variant="ghost"
        >
          <Trash2 size={17} />
        </Button>
      </div>
      <AddLinkForm />
      {items.length === 0 ? (
        <EmptyPlaylist />
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
            <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
              {items.map((item, index) => (
                <PlaylistItem
                  isCurrent={index === currentIndex}
                  item={item}
                  key={item.id}
                  onRemove={removeItem}
                  onSelect={() => setCurrentIndex(index)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </aside>
  );
}
