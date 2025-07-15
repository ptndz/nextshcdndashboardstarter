// file: lib/tree.ts

export interface ComponentItem {
  id: string;
  type: string;
  props: Record<string, any>;
  className?: string;
  children?: ComponentItem[];
}

/**
 * Thêm một component con vào một component cha dựa vào ID.
 * Hàm này xử lý trường hợp đặc biệt cho parentId là 'root'.
 */
export function addToParentById(
  items: ComponentItem[],
  parentId: string,
  newItem: ComponentItem
): ComponentItem[] {
  // Nếu thả vào canvas gốc, chỉ cần thêm vào mảng items
  if (parentId === 'root') {
    return [...items, newItem];
  }

  // Nếu thả vào một component khác, tìm và cập nhật nó
  return items.map((item) => {
    if (item.id === parentId) {
      // Tìm thấy component cha, thêm component mới vào children của nó
      return {
        ...item,
        children: [...(item.children || []), newItem]
      };
    }
    // Nếu không phải, tìm kiếm đệ quy trong children
    if (item.children) {
      return {
        ...item,
        children: addToParentById(item.children, parentId, newItem)
      };
    }
    return item;
  });
}

/**
 * Tìm một component trong cây dựa vào ID.
 */
export function findComponentById(
  items: ComponentItem[],
  id: string | null
): ComponentItem | null {
  if (!id) return null;

  for (const item of items) {
    if (item.id === id) {
      return item;
    }
    if (item.children) {
      const found = findComponentById(item.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

/**
 * Cập nhật một component trong cây.
 */
export function updateTree(
  items: ComponentItem[],
  id: string,
  updated: ComponentItem
): ComponentItem[] {
  return items.map((item) => {
    if (item.id === id) {
      return updated;
    }
    if (item.children) {
      return { ...item, children: updateTree(item.children, id, updated) };
    }
    return item;
  });
}
/**
 * Xóa một component khỏi cây dựa vào ID.
 */
export function deleteComponentById(
  items: ComponentItem[],
  id: string
): ComponentItem[] {
  // Lọc bỏ item ở cấp hiện tại nếu trùng ID
  const filteredItems = items.filter((item) => item.id !== id);

  // Áp dụng đệ quy cho các children của những item còn lại
  return filteredItems.map((item) => {
    if (item.children) {
      return {
        ...item,
        children: deleteComponentById(item.children, id)
      };
    }
    return item;
  });
}

/**
 * Chèn một mục mới vào cây, có thể ở trước, sau, hoặc bên trong một mục tiêu.
 * @param items Mảng các component hiện tại.
 * @param newItem Component mới cần chèn.
 * @param targetId ID của component mục tiêu.
 * @param position Vị trí chèn: 'before', 'after', hoặc 'inside'.
 * @returns Mảng component đã được cập nhật.
 */
export function insertItem(
  items: ComponentItem[],
  newItem: ComponentItem,
  targetId: string,
  position: 'before' | 'after' | 'inside'
): ComponentItem[] {
  // Trường hợp 1: Thả vào bên trong một container
  if (position === 'inside') {
    return items.map((item) => {
      if (item.id === targetId) {
        // Đảm bảo children là một mảng trước khi thêm vào
        const children = item.children ? [...item.children] : [];
        children.push(newItem);
        return { ...item, children };
      }
      if (item.children) {
        return {
          ...item,
          children: insertItem(item.children, newItem, targetId, position)
        };
      }
      return item;
    });
  }

  // Trường hợp 2 & 3: Thả vào trước/sau một component anh em
  const findAndInsert = (
    currentItems: ComponentItem[]
  ): ComponentItem[] | null => {
    const targetIndex = currentItems.findIndex((item) => item.id === targetId);

    if (targetIndex !== -1) {
      const newArray = [...currentItems];
      const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
      newArray.splice(insertIndex, 0, newItem);
      return newArray;
    }

    for (const item of currentItems) {
      if (item.children) {
        const newChildren = findAndInsert(item.children);
        if (newChildren) {
          // Nếu tìm thấy và đã chèn, trả về mảng đã được cập nhật
          return currentItems.map((i) =>
            i.id === item.id ? { ...i, children: newChildren } : i
          );
        }
      }
    }

    return null; // Không tìm thấy ở cấp này
  };

  const result = findAndInsert(items);
  return result || items; // Trả về mảng đã cập nhật hoặc mảng gốc nếu không tìm thấy
}
