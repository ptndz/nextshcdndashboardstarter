'use client';
import { DraggablePaletteButton } from './draggable/draggable-palette-button';

export function Sidebar() {
  const layouts = [
    'div-container',
    'layout-2-cols',
    'layout-3-cols',
    'layout-custom-cols'
  ];
  const components = [
    'button',
    'input',
    'textarea',
    'select',
    'checkbox',
    'radio',
    'switch',
    'slider',
    'card',
    'alert',
    'badge',
    'avatar',
    'tooltip',
    'accordion',
    'tabs',
    'dialog',
    'popover',
    'dropdown-menu',
    'hover-card',
    'progress',
    'separator',
    'sheet',
    'toast',
    'collapse',
    'scroll-area',
    'menubar',
    'breadcrumb',
    'pagination',
    'table',
    'form',
    'label',
    'calendar',
    'command',
    'skeleton'
  ];

  return (
    <div className="flex h-full w-60 flex-col border-r bg-slate-50 p-4">
      <div className="flex-grow overflow-y-auto pr-2">
        {/* Phần Layouts */}
        <div className="mb-6">
          <h2 className="mb-2 text-sm font-semibold text-slate-500">Layouts</h2>
          <div className="space-y-2">
            {layouts.map((type) => (
              <DraggablePaletteButton key={type} type={type} />
            ))}
          </div>
        </div>

        {/* Phần Components */}
        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-500">
            Components
          </h2>
          <div className="space-y-2 pb-10">
            {components.map((type) => (
              <DraggablePaletteButton key={type} type={type} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
