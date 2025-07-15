'use client';
import { useDroppable } from '@dnd-kit/core';
import { ComponentRenderer } from './renderer';

export interface ComponentItem {
  id: string;
  type: string;
  props: Record<string, any>;
  className?: string;
  children?: ComponentItem[];
}

interface CanvasProps {
  items: ComponentItem[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  dropIndicator: {
    targetId: string;
    position: 'before' | 'after' | 'inside';
  } | null;
  onComponentAction: (actionUrl: string) => void;
}

export function Canvas({
  items,
  selectedId,
  setSelectedId,
  dropIndicator,
  onComponentAction
}: CanvasProps) {
  const { setNodeRef, isOver } = useDroppable({ id: 'root' });

  // Highlight khu vực gốc chỉ khi nó trống và đang được kéo qua
  const rootDropZoneClass =
    isOver && items.length === 0 ? 'bg-blue-100/50' : 'bg-slate-100';

  return (
    <div
      className={`flex-1 overflow-auto p-4 transition-colors duration-200 ${rootDropZoneClass}`}
    >
      <div
        ref={setNodeRef}
        className="grid min-h-full content-start gap-4 rounded-lg border-2 border-dashed border-slate-300 p-4"
      >
        {items.length > 0 ? (
          items.map((item) => (
            <ComponentRenderer
              key={item.id}
              item={item}
              onClick={(id: string) => setSelectedId(id)}
              isSelected={item.id === selectedId}
              selectedId={selectedId}
              dropIndicator={dropIndicator}
              onComponentAction={onComponentAction}
            />
          ))
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            Kéo component từ sidebar và thả vào đây
          </div>
        )}
      </div>
    </div>
  );
}
