'use client';

import { X } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { RelationContentArrayUpdate } from '@/types';
import { Command as CommandPrimitive } from 'cmdk';
export type IFancyMultiSelect = {
  value: string;
  label: React.ReactNode;
};

export interface FancyMultiSelectProps {
  data: IFancyMultiSelect[];
  selected: IFancyMultiSelect[];
  placeholder: string;
  onChange: (value: RelationContentArrayUpdate) => void;
}

export function FancyMultiSelect(props: FancyMultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<IFancyMultiSelect[]>(
    props.selected
  );
  const [inputValue, setInputValue] = React.useState('');
  const [removedItems, setRemovedItems] = React.useState<IFancyMultiSelect[]>(
    []
  );

  const handleUnselect = React.useCallback((item: IFancyMultiSelect) => {
    setSelected((prev) => prev.filter((s) => s.value !== item.value));
    setRemovedItems((prev) => {
      const valueExists = prev.find((s) => s.value === item.value);
      if (valueExists) {
        return prev;
      } else {
        return [...prev, item];
      }
    });
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '') {
            setRemovedItems((prev) => {
              const lastSelected = selected.at(-1);

              if (!lastSelected) {
                return prev;
              }
              const valueExists = prev.find(
                (s) => s.value === lastSelected.value
              );
              if (valueExists) {
                return prev;
              } else {
                return [...prev, lastSelected];
              }
            });
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === 'Escape') {
          input.blur();
        }
      }
    },
    [selected]
  );

  React.useEffect(() => {
    props.onChange({
      $add: selected.map((item) => item.value),
      $clear: removedItems.map((item) => item.value)
    });
  }, [selected, removedItems, props]);

  const selectables = props.data.filter(
    (item) =>
      !selected.some((selectedItem) => selectedItem.value === item.value)
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((item) => {
            return (
              <Badge key={item.value} variant="secondary">
                {item.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(item);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => {
                    handleUnselect(item);
                  }}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={props.placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((item) => {
                  return (
                    <CommandItem
                      key={item.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue('');
                        setSelected((prev) => [...prev, item]);
                        setRemovedItems((prev) => {
                          const itemToRemove = prev.find(
                            (s) => s.value === item.value
                          );

                          if (itemToRemove) {
                            return prev.filter((s) => s.value !== item.value);
                          }
                          return prev;
                        });
                      }}
                      className={'cursor-pointer'}
                    >
                      {item.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
