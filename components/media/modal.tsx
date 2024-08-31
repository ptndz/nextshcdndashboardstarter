import { Button } from '@/components/common/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Media } from '@/types';
import { useState } from 'react';
import { MediaList } from './list';

export interface MediaModalProps {
  multiple?: boolean;
  onSelect?: (medias: Media[]) => void;
}

export const MediaModal = (props: MediaModalProps) => {
  const { onSelect, multiple } = props;
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col space-y-2">
      <div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setOpen(true)}
        >
          Select Media
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-[80%] max-h-[80%] w-[80%] max-w-[80%] flex-col">
          <DialogHeader className="block">
            <DialogTitle>Media Library</DialogTitle>
          </DialogHeader>
          <div className="flex h-full flex-1 flex-col overflow-hidden">
            <ScrollArea className="h-full">
              <MediaList
                showUploader
                multiple={multiple}
                onInsert={(medias) => {
                  onSelect?.(medias);
                  setOpen(false);
                }}
              />
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
