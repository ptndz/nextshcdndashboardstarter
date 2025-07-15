'use client';

import { getDefaultProps } from '@/lib/defaultProps';
import {
  ComponentItem,
  deleteComponentById,
  findComponentById,
  insertItem,
  updateTree
} from '@/lib/tree';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Canvas } from './canvas';
import { Editor } from './editor';
import { Sidebar } from './sidebar';

export function Playground() {
  const [items, setItems] = useState<ComponentItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<ComponentItem | null>(null);

  const [dropIndicator, setDropIndicator] = useState<{
    targetId: string;
    position: 'before' | 'after' | 'inside';
  } | null>(null);

  // **NÂNG CẤP: Thêm state và logic để thay đổi kích thước Editor**
  const [editorWidth, setEditorWidth] = useState(288); // 72 * 4
  const isResizing = useRef(false);

  const handleResize = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    // Tính toán chiều rộng mới, đặt giới hạn
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth > 250 && newWidth < 800) {
      setEditorWidth(newWidth);
    }
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    window.removeEventListener('mousemove', handleResize);
    window.removeEventListener('mouseup', stopResizing);
    document.body.style.cursor = 'default'; // Trả lại con trỏ chuột
  }, [handleResize]);

  const startResizing = useCallback(() => {
    isResizing.current = true;
    window.addEventListener('mousemove', handleResize);
    window.addEventListener('mouseup', stopResizing);
    document.body.style.cursor = 'col-resize'; // Đổi kiểu con trỏ chuột
  }, [handleResize, stopResizing]);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const saved = localStorage.getItem('saved-ui');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const handleUpdate = (id: string, updated: ComponentItem) => {
    const newTree = updateTree(items, id, updated);
    setItems(newTree);
    localStorage.setItem('saved-ui', JSON.stringify(newTree));
  };

  const handleDelete = (id: string) => {
    const newTree = deleteComponentById(items, id);
    setItems(newTree);
    setSelectedId(null);
    localStorage.setItem('saved-ui', JSON.stringify(newTree));
  };

  const handleComponentAction = async (actionUrl: string) => {
    if (!actionUrl) {
      console.log('No action URL provided.');
      return;
    }

    console.log(`Fetching data from: ${actionUrl}`);
    try {
      const response = await fetch(actionUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetch successful! Data received:', data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  function handleDragStart(event: DragStartEvent) {
    const type = event.active.data.current?.type as string;
    if (type) {
      setActiveItem({
        id: event.active.id as string,
        type,
        props: getDefaultProps(type),
        children: []
      });
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) {
      setDropIndicator(null);
      return;
    }

    const overId = over.id as string;
    const overRect = over.rect;

    const activeRect = active.rect.current.translated;
    if (!activeRect) {
      return;
    }

    const overItem = findComponentById(items, overId);

    // **CẬP NHẬT: Thêm các loại layout mới vào danh sách container**
    const canDropInside =
      overItem &&
      [
        'div-container',
        'layout-2-cols',
        'layout-3-cols',
        'layout-custom-cols',
        'card',
        'form',
        'accordion',
        'dialog',
        'sheet',
        'tabs',
        'scroll-area',
        'popover',
        'dropdown-menu',
        'menubar'
      ].includes(overItem.type);

    const dropZoneHeight = overRect.height;
    const dropZoneTop = overRect.top;

    const draggedItemCenterY = activeRect.top + activeRect.height / 2;

    const topThreshold = dropZoneTop + dropZoneHeight * 0.3;
    const bottomThreshold = dropZoneTop + dropZoneHeight * 0.7;

    let position: 'inside' | 'before' | 'after';

    if (
      canDropInside &&
      draggedItemCenterY > topThreshold &&
      draggedItemCenterY < bottomThreshold
    ) {
      position = 'inside';
    } else if (draggedItemCenterY <= dropZoneTop + dropZoneHeight / 2) {
      position = 'before';
    } else {
      position = 'after';
    }

    if (
      dropIndicator?.targetId !== overId ||
      dropIndicator?.position !== position
    ) {
      setDropIndicator({ targetId: overId, position });
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active } = event;
    const componentType = active.data.current?.type as string;

    if (componentType && dropIndicator?.targetId) {
      const newItem: ComponentItem = {
        id: uuidv4(),
        type: componentType,
        props: getDefaultProps(componentType),
        className: '',
        children: []
      };

      const updatedItems = insertItem(
        items,
        newItem,
        dropIndicator.targetId,
        dropIndicator.position
      );
      setItems(updatedItems);
      localStorage.setItem('saved-ui', JSON.stringify(updatedItems));
    }

    setActiveItem(null);
    setDropIndicator(null);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        setActiveItem(null);
        setDropIndicator(null);
      }}
    >
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <Canvas
          items={items}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          dropIndicator={dropIndicator}
          onComponentAction={handleComponentAction}
        />
        <Editor
          selected={findComponentById(items, selectedId)}
          onChange={handleUpdate}
          onDelete={handleDelete}
          width={editorWidth} // Truyền chiều rộng xuống
          onResizeStart={startResizing} // Truyền hàm bắt đầu resize
        />
      </div>

      <DragOverlay dropAnimation={null}>
        {activeItem ? (
          <button className="cursor-grabbing rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-lg">
            {activeItem.type}
          </button>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
