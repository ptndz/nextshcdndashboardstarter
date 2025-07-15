'use client';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export function DraggablePaletteButton({ type }: { type: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${type}`,
    // Sử dụng 'data' để truyền thông tin bổ sung
    data: {
      type: type
    }
  });

  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Translate.toString(transform),
        cursor: 'grab',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        background: 'white',
        marginBottom: '6px',
        width: '100%'
      }}
    >
      {type}
    </button>
  );
}
