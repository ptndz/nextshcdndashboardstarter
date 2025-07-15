import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger
} from '@/components/ui/menubar';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useDroppable } from '@dnd-kit/core';
import { ComponentItem } from './canvas'; // Import interface từ canvas
interface ComponentRendererProps {
  item: ComponentItem;
  onClick: (id: string) => void;
  isSelected: boolean;
  selectedId: string | null;
  dropIndicator: {
    targetId: string;
    position: 'before' | 'after' | 'inside';
  } | null;
  onComponentAction: (actionUrl: string) => void;
}

export function ComponentRenderer({
  item,
  onClick,
  isSelected,
  selectedId,
  dropIndicator,
  onComponentAction
}: ComponentRendererProps) {
  const { id, type, props, className, children } = item;
  const { setNodeRef } = useDroppable({ id });

  const childNodes = children?.map((child) => (
    <ComponentRenderer
      key={child.id}
      item={child}
      onClick={onClick}
      isSelected={child.id === selectedId}
      selectedId={selectedId}
      dropIndicator={dropIndicator}
      onComponentAction={onComponentAction}
    />
  ));

  const isTarget = dropIndicator?.targetId === id;
  const showBeforeIndicator = isTarget && dropIndicator?.position === 'before';
  const showAfterIndicator = isTarget && dropIndicator?.position === 'after';
  const showInsideIndicator = isTarget && dropIndicator?.position === 'inside';

  const droppableContent = (placeholder: string) => {
    const placeholderClass = showInsideIndicator
      ? 'bg-blue-200/50'
      : 'bg-slate-200/50';
    return childNodes && childNodes.length > 0 ? (
      childNodes
    ) : (
      <div
        className={`pointer-events-none flex min-h-[60px] items-center justify-center rounded-md text-xs text-slate-500 transition-colors duration-200 ${placeholderClass}`}
      >
        {placeholder}
      </div>
    );
  };

  const renderTheComponent = () => {
    const borderClass = isSelected
      ? 'border-blue-500'
      : 'border-transparent hover:border-blue-400';
    const componentWrapperClass = `border-2 ${borderClass} ${className || ''} ${
      showInsideIndicator ? 'ring-2 ring-blue-500 ring-offset-2' : ''
    }`;
    // **NÂNG CẤP: Tạo hàm xử lý click mới**
    const handleWrapperClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick(id); // Luôn thực hiện việc chọn component

      // Nếu có action được định nghĩa, thực thi nó
      if (props.onClickAction) {
        onComponentAction(props.onClickAction);
      }
    };
    const commonProps = {
      className: componentWrapperClass,
      onClick: handleWrapperClick
    };

    switch (type) {
      case 'layout-2-cols':
        return (
          <div {...commonProps}>{droppableContent(`Thả vào Layout 2 cột`)}</div>
        );

      case 'layout-3-cols':
        return (
          <div {...commonProps}>{droppableContent(`Thả vào Layout 3 cột`)}</div>
        );

      case 'div-container':
        return (
          <div {...commonProps}>{droppableContent(`Thả vào Container`)}</div>
        );

      case 'layout-custom-cols':
        // Sử dụng inline style để tạo số cột động
        const customStyle = {
          gridTemplateColumns: `repeat(${props.cols || 2}, minmax(0, 1fr))`
        };
        return (
          <div {...commonProps} style={customStyle}>
            {droppableContent(`Thả vào Layout`)}
          </div>
        );
      case 'button':
        return <Button {...commonProps}>{props.label}</Button>;
      case 'input':
        return <Input {...commonProps} placeholder={props.placeholder} />;
      case 'textarea':
        return <Textarea {...commonProps} placeholder={props.placeholder} />;
      case 'select':
        return (
          <Select>
            <SelectTrigger {...commonProps}>
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {(props.options || []).map((option: string) => (
                <SelectItem
                  key={option}
                  value={option.toLowerCase().replace(/\s/g, '-')}
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'checkbox':
        return (
          <div
            {...commonProps}
            className={`flex items-center space-x-2 ${componentWrapperClass}`}
          >
            <Checkbox id={`${id}-chk`} />
            <Label htmlFor={`${id}-chk`}>{props.label}</Label>
          </div>
        );
      case 'radio':
        return (
          <div
            {...commonProps}
            className={`flex items-center space-x-2 ${componentWrapperClass}`}
          >
            <RadioGroup defaultValue="option-one">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-one" id={`${id}-radio`} />
                <Label htmlFor={`${id}-radio`}>{props.label}</Label>
              </div>
            </RadioGroup>
          </div>
        );
      case 'switch':
        return (
          <div
            {...commonProps}
            className={`flex items-center space-x-2 ${componentWrapperClass}`}
          >
            <Switch id={`${id}-switch`} />
            <Label htmlFor={`${id}-switch`}>Toggle</Label>
          </div>
        );
      case 'slider':
        return (
          <Slider
            {...commonProps}
            defaultValue={props.defaultValue}
            max={100}
            step={1}
          />
        );
      case 'label':
        return <Label {...commonProps}>{props.text}</Label>;
      case 'separator':
        return <Separator {...commonProps} />;
      case 'progress':
        return <Progress {...commonProps} value={props.value} />;
      case 'skeleton':
        return (
          <Skeleton
            {...commonProps}
            style={{ width: props.width, height: props.height }}
          />
        );
      case 'badge':
        return <Badge {...commonProps}>{props.text}</Badge>;
      case 'avatar':
        return (
          <Avatar {...commonProps}>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>{props.fallback}</AvatarFallback>
          </Avatar>
        );
      case 'alert':
        return (
          <Alert {...commonProps}>
            <AlertTitle>{props.title}</AlertTitle>
            <AlertDescription>{props.description}</AlertDescription>
          </Alert>
        );
      case 'calendar':
        return (
          <Calendar
            {...commonProps}
            mode="single"
            selected={new Date()}
            className={`rounded-md border ${componentWrapperClass}`}
          />
        );
      case 'command':
        return (
          <Command {...commonProps}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>Calendar</CommandItem>
                <CommandItem>Search Emoji</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        );
      case 'pagination':
        return (
          <Pagination {...commonProps}>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        );
      case 'breadcrumb':
        return (
          <Breadcrumb {...commonProps}>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/components">Components</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        );
      case 'card':
        return (
          <Card {...commonProps}>
            <CardHeader>
              <CardTitle>{props.title}</CardTitle>
              <CardDescription>{props.description}</CardDescription>
            </CardHeader>
            <CardContent className="grid min-h-[80px] content-start gap-4">
              {droppableContent('Thả vào Card')}
            </CardContent>
          </Card>
        );
      case 'accordion':
        return (
          <Accordion type="single" collapsible {...commonProps}>
            <AccordionItem value="item-1">
              <AccordionTrigger>{props.title}</AccordionTrigger>
              <AccordionContent className="p-2">
                {droppableContent('Thả vào Accordion')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      case 'form':
        return (
          <form
            {...commonProps}
            className={`min-h-[100px] rounded-lg bg-white/50 p-4 ${componentWrapperClass}`}
          >
            {droppableContent(`Thả các trường input vào Form`)}
          </form>
        );
      case 'scroll-area':
        return (
          <ScrollArea
            {...commonProps}
            className={`h-32 w-full rounded-md border ${componentWrapperClass}`}
          >
            <div className="h-full p-4">
              {droppableContent(`Thả vào ScrollArea`)}
            </div>
          </ScrollArea>
        );
      case 'collapse':
        return (
          <Collapsible
            {...commonProps}
            className={`w-full space-y-2 ${componentWrapperClass}`}
          >
            <div className="flex items-center justify-between space-x-4 px-4">
              <h4 className="text-sm font-semibold">{props.title}</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <div className="rounded-md border px-4 py-3 font-mono text-sm">
              {props.content}
            </div>
            <CollapsibleContent className="space-y-2 border-t p-2">
              {droppableContent('Thả vào đây')}
            </CollapsibleContent>
          </Collapsible>
        );
      case 'tooltip':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">{props.buttonText}</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{props.text}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'dialog':
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">{props.buttonText}</Button>
            </DialogTrigger>
            <DialogContent
              className={`sm:max-w-[425px] ${
                showInsideIndicator ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
            >
              <DialogHeader>
                <DialogTitle>{props.title}</DialogTitle>
                <DialogDescription>{props.description}</DialogDescription>
              </DialogHeader>
              <div className="grid min-h-[100px] gap-4 py-4">
                {droppableContent('Thả vào Dialog')}
              </div>
            </DialogContent>
          </Dialog>
        );
      case 'sheet':
        return (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">{props.buttonText}</Button>
            </SheetTrigger>
            <SheetContent
              className={
                showInsideIndicator ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }
            >
              <SheetHeader>
                <SheetTitle>{props.title}</SheetTitle>
                <SheetDescription>{props.description}</SheetDescription>
              </SheetHeader>
              <div className="grid min-h-[100px] gap-4 py-4">
                {droppableContent('Thả vào Sheet')}
              </div>
            </SheetContent>
          </Sheet>
        );
      case 'popover':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">{props.buttonText}</Button>
            </PopoverTrigger>
            <PopoverContent
              className={`w-80 ${
                showInsideIndicator ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
            >
              <div className="grid min-h-[80px] gap-4">
                {droppableContent('Thả vào Popover')}
              </div>
            </PopoverContent>
          </Popover>
        );
      case 'dropdown-menu':
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{props.buttonText}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={`w-56 ${
                showInsideIndicator ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="grid min-h-[80px] gap-1 p-1">
                {droppableContent('Thả vào Menu')}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      case 'menubar':
        return (
          <Menubar {...commonProps}>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <div className="grid min-h-[80px] gap-1 p-1">
                  {droppableContent('Thả vào Menu')}
                </div>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        );
      case 'tabs':
        return (
          <Tabs defaultValue="account" {...commonProps}>
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent
              value="account"
              className={`min-h-[100px] rounded-md border border-dashed p-4 ${
                showInsideIndicator ? 'border-blue-400 bg-blue-100/50' : ''
              }`}
            >
              {droppableContent('Thả vào Tab "Account"')}
            </TabsContent>
            <TabsContent value="password">
              Change your password here.
            </TabsContent>
          </Tabs>
        );
      case 'table':
        return (
          <Table {...commonProps}>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={showInsideIndicator ? 'bg-blue-100/50' : ''}>
              {childNodes && childNodes.length > 0 ? (
                childNodes
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Thả các component (ví dụ: TableRow) vào đây.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        );

      default:
        return (
          <div className="border border-dashed border-red-400 p-2">
            <p className="text-xs text-red-500">
              Component chưa được render: {type}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={setNodeRef}>
      {showBeforeIndicator && (
        <div className="absolute left-0 top-[-4px] z-10 h-1.5 w-full rounded-full bg-blue-500" />
      )}
      {renderTheComponent()}
      {showAfterIndicator && (
        <div className="absolute bottom-[-4_px] left-0 z-10 h-1.5 w-full rounded-full bg-blue-500" />
      )}
    </div>
  );
}
