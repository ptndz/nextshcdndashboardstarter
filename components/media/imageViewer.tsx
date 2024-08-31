'use client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Media } from '@/types';
import { DialogTitle } from '@radix-ui/react-dialog';
import * as React from 'react';
import FileViewer from 'react-file-viewer';
interface ImageViewerProps {
  media: Media;
  open: boolean;
  onClose: () => void;
}
const ImageViewer: React.FC<ImageViewerProps> = ({ media, open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle>{media.name}</DialogTitle>
      <DialogContent className="w-full max-w-3xl p-0">
        {media.type.startsWith('image/') ? (
          <img
            src={media.url}
            alt={media.name}
            className="h-auto w-full object-contain"
          />
        ) : (
          <FileViewer
            fileType={
              media.type.includes('application/')
                ? media.type.split('/')[1]
                : media.type
            }
            filePath={media.url}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
export default ImageViewer;
