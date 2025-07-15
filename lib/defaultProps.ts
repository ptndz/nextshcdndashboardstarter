// file: lib/defaultProps.ts

export function getDefaultProps(type: string): Record<string, any> {
  switch (type) {
    // --- Form Components ---
    case 'button':
      return { label: 'Button' };
    case 'input':
      return { placeholder: 'Enter text...' };
    case 'textarea':
      return { placeholder: 'Enter a longer text...' };
    case 'select':
      return {
        placeholder: 'Select an option',
        options: ['Option 1', 'Option 2']
      };
    case 'checkbox':
      return { label: 'Accept terms' };
    case 'radio':
      return { label: 'Option one' };
    case 'switch':
      return {};
    case 'slider':
      return { defaultValue: [50] };
    case 'form':
      return {};
    case 'label':
      return { text: 'Your Label' };

    // --- Layout & Container Components ---
    case 'card':
      return { title: 'Card Title', description: 'Card Description' };
    case 'accordion':
      return { title: 'Section 1', content: 'Content for section 1.' };
    case 'tabs':
      return {
        tabs: [{ value: 'tab1', title: 'Tab 1', content: 'Content for tab 1.' }]
      };
    case 'dialog':
      return {
        title: 'Dialog Title',
        description: 'This is a dialog description.',
        buttonText: 'Open Dialog'
      };
    case 'sheet':
      return {
        title: 'Sheet Title',
        description: 'This is a sheet description.',
        buttonText: 'Open Sheet'
      };
    case 'scroll-area':
      return {};
    case 'separator':
      return {};
    case 'collapse':
      return {
        title: 'Toggle Collapse',
        content: 'This is the collapsible content.'
      };

    // --- Display Components ---
    case 'alert':
      return { title: 'Heads up!', description: 'You can add details here.' };
    case 'badge':
      return { text: 'Badge' };
    case 'avatar':
      return { fallback: 'CN' };
    case 'tooltip':
      return { text: 'Tooltip content', buttonText: 'Hover me' };
    case 'popover':
      return {
        title: 'Popover Title',
        content: 'Popover content here.',
        buttonText: 'Open Popover'
      };
    case 'hover-card':
      return { text: 'Hover me', content: 'Content for the hover card.' };
    case 'progress':
      return { value: 33 };
    case 'skeleton':
      return { width: '100px', height: '20px' };
    case 'toast':
      return {
        title: 'Scheduled: Catch up',
        description: 'Friday, February 10, 2023 at 5:57 PM'
      };

    // --- Navigation & Menu ---
    case 'dropdown-menu':
      return { buttonText: 'Open Menu' };
    case 'menubar':
      return {};
    case 'breadcrumb':
      return { links: ['Home', 'Components', 'Breadcrumb'] };
    case 'pagination':
      return { total: 5 };

    // --- Data & Other ---
    case 'table':
      return {};
    case 'calendar':
      return {};
    case 'command':
      return { placeholder: 'Search...' };
    case 'div-container':
      return {
        className:
          'p-4 min-h-[100px] bg-white/50 rounded-lg flex flex-col gap-4'
      };
    case 'layout-2-cols':
      return {
        className: 'grid grid-cols-2 gap-4 p-2 min-h-[100px] rounded-lg'
      };
    case 'layout-3-cols':
      return {
        className: 'grid grid-cols-3 gap-4 p-2 min-h-[100px] rounded-lg'
      };
    case 'layout-custom-cols':
      return { className: 'grid gap-4 p-2 min-h-[100px] rounded-lg', cols: 2 };
    default:
      return {};
  }
}
