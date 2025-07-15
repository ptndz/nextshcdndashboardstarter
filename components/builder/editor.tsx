'use client';

import { Code, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
// NÂNG CẤP: Import thư viện chỉnh sửa JSON
import { JsonEditor, UpdateFunctionProps } from 'json-edit-react';

export interface ComponentItem {
  id: string;
  type: string;
  props: Record<string, any>;
  className?: string;
  children?: ComponentItem[];
}

interface EditorProps {
  selected: ComponentItem | null;
  onChange: (id: string, updated: ComponentItem) => void;
  onDelete: (id: string) => void;
  width: number; // Prop mới cho chiều rộng
  onResizeStart: () => void; // Prop mới cho hàm bắt đầu resize
}

// Component phụ cho các ô nhập liệu ở chế độ UI
const PropertyInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text'
}: any) => (
  <div>
    <label className="text-xs text-slate-500">{label}</label>
    <input
      type={type}
      className="w-full rounded-md border bg-slate-50 px-2 py-1"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

export function Editor({
  selected,
  onChange,
  onDelete,
  width,
  onResizeStart
}: EditorProps) {
  const [view, setView] = useState<'ui' | 'json'>('ui');

  // Khi component được chọn thay đổi, tự động chuyển về view UI
  useEffect(() => {
    setView('ui');
  }, [selected]);

  if (!selected) {
    return (
      <div className="w-64 border-l bg-slate-50 p-4">
        <p className="text-sm text-slate-500">
          Chọn một component để chỉnh sửa
        </p>
      </div>
    );
  }

  const handlePropChange = (propName: string, value: any) => {
    onChange(selected.id, {
      ...selected,
      props: { ...selected.props, [propName]: value }
    });
  };

  const handleClassChange = (value: string) => {
    onChange(selected.id, { ...selected, className: value });
  };

  // Hàm xử lý khi có cập nhật từ JsonEditor
  const handleJsonUpdate = (props: UpdateFunctionProps) => {
    const { newData } = props;

    // Validate dữ liệu mới
    if (!newData || typeof newData !== 'object') return;
    const newItem = newData as ComponentItem;

    if (!newItem.id || !newItem.type) {
      console.warn('Dữ liệu JSON thiếu id hoặc type.');
      return;
    }

    if (selected && JSON.stringify(newItem) !== JSON.stringify(selected)) {
      onChange(selected.id, newItem);
    }
  };

  const renderUiView = () => (
    <>
      <div className="space-y-2">
        <h3 className="border-b pb-1 text-xs font-semibold text-slate-500">
          Thuộc tính
        </h3>
        {selected.type === 'button' && (
          <PropertyInput
            label="Label"
            value={selected.props.label || ''}
            onChange={(e: any) => handlePropChange('label', e.target.value)}
          />
        )}
        {selected.type === 'layout-custom-cols' && (
          <PropertyInput
            label="Số cột (columns)"
            type="number"
            value={selected.props.cols || 2}
            onChange={(e: any) =>
              handlePropChange('cols', parseInt(e.target.value, 10))
            }
          />
        )}
      </div>
      {selected.type === 'button' && (
        <div className="space-y-2">
          <h3 className="border-b pb-1 text-xs font-semibold text-slate-500">
            Action (onClick)
          </h3>
          <PropertyInput
            label="API Endpoint URL"
            value={selected.props.onClickAction || ''}
            onChange={(e: any) =>
              handlePropChange('onClickAction', e.target.value)
            }
            placeholder="https://api.example.com/data"
          />
        </div>
      )}
      <div className="space-y-2">
        <h3 className="border-b pb-1 text-xs font-semibold text-slate-500">
          Styling
        </h3>
        <PropertyInput
          label="ClassName"
          value={selected.className || ''}
          onChange={(e: any) => handleClassChange(e.target.value)}
        />
      </div>
    </>
  );

  const renderJsonView = () => (
    <div className="flex-grow overflow-auto text-xs">
      <JsonEditor data={selected} onUpdate={handleJsonUpdate} />
    </div>
  );

  return (
    <div
      className="relative flex h-full flex-col bg-slate-50"
      style={{ width: `${width}px` }}
    >
      {/* Tay cầm để thay đổi kích thước */}
      <div
        className="group absolute -left-1.5 top-0 h-full w-3 cursor-col-resize"
        onMouseDown={(e) => {
          e.preventDefault();
          onResizeStart();
        }}
      >
        <div className="h-full w-px bg-slate-200 transition-colors duration-200 group-hover:bg-blue-400"></div>
      </div>

      {/* Nội dung Editor */}
      <div className="flex h-full flex-col p-4">
        {!selected ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-500">
              Chọn một component để chỉnh sửa
            </p>
          </div>
        ) : (
          <>
            <div className="flex min-h-0 flex-grow flex-col">
              <div className="mb-4 flex flex-shrink-0 items-center justify-between">
                <h2 className="truncate text-sm font-bold uppercase text-slate-600">
                  Chỉnh sửa:{' '}
                  <span className="text-blue-600">{selected.type}</span>
                </h2>
                <div className="flex items-center rounded-md border bg-slate-200 p-0.5">
                  <button
                    onClick={() => setView('ui')}
                    className={`rounded p-1 ${
                      view === 'ui' ? 'bg-white shadow-sm' : ''
                    }`}
                  >
                    <Pencil
                      size={16}
                      className={
                        view === 'ui' ? 'text-blue-600' : 'text-slate-500'
                      }
                    />
                  </button>
                  <button
                    onClick={() => setView('json')}
                    className={`rounded p-1 ${
                      view === 'json' ? 'bg-white shadow-sm' : ''
                    }`}
                  >
                    <Code
                      size={16}
                      className={
                        view === 'json' ? 'text-blue-600' : 'text-slate-500'
                      }
                    />
                  </button>
                </div>
              </div>

              {view === 'ui' ? renderUiView() : renderJsonView()}
            </div>

            <div className="mt-4 flex-shrink-0 border-t border-slate-200 pt-4">
              <h3 className="mb-2 text-xs font-semibold text-red-600/70">
                Vùng nguy hiểm
              </h3>
              <button
                onClick={() => onDelete(selected.id)}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-red-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-red-600"
              >
                <Trash2 size={14} />
                Xóa Component
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
