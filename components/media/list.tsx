import { Button } from '@/components/common/button';
import { SystemError } from '@/components/common/error';
import { Loading } from '@/components/common/loading';
import {
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { useToast } from '@/components/ui/use-toast';
import { deleteFiles } from '@/lib/media';
import { Get } from '@/lib/request';
import { cn } from '@/lib/utils';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import { useClipboard } from '@/hooks/useClipboard';
import { Media, Pagination } from '@/types';
import { ExternalLinkIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import {
  BoxSelect,
  ChevronLeft,
  ChevronRight,
  CopyIcon,
  FileIcon,
  Trash2,
  X
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { MediaUploader } from './uploader';

const ImageViewer = dynamic(() => import('./imageViewer'), {
  ssr: false
});
const fileIcon = (
  <FileIcon className="w-[50%] text-slate-300" width="50%" height="50%" />
);
export interface MediaListProps {
  showUploader?: boolean;
  onInsert?: (medias: Media[]) => void;
  multiple?: boolean;
}

export const MediaList = (props: MediaListProps) => {
  const { showUploader, onInsert, multiple } = props;
  const [page, setPage] = useState(1);
  const [selectedMedias, setSelectedMedias] = useState<Media[]>([]);
  const [uploadedMedias, setUploadedMedias] = useState<Media[]>([]);
  const [filteredResults, setFilteredResults] = useState<Media[] | undefined>(
    []
  );

  const [searchInput, setSearchInput] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const [openImageId, setOpenImageId] = useState<number | null>(null);

  const handleOpenImage = (id: number) => {
    setOpenImageId(id);
  };

  const handleCloseImage = () => {
    setOpenImageId(null);
  };

  const { toast } = useToast();
  const { copyToClipboard, state } = useClipboard();
  const getMediaList = async (limit: number, page: number) => {
    const query: { [k: string]: any } = {};
    limit && (query['limit'] = limit);
    page && (query['page'] = page);
    const queryString = new URLSearchParams(query).toString();

    return await Get<Pagination<Media>>(`/files?${queryString}`);
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['file', page],
    queryFn: () => getMediaList(20, page),
    retry: 0
  });
  const selectedMedia = data?.items.find((media) => media.id === openImageId);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenSearch((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const searchItems = (searchValue: string) => {
    setSearchInput(searchValue);
    if (searchInput !== '') {
      const filteredData = data?.items.filter((item) => {
        return Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(searchInput.toLowerCase())
        );
      });

      setFilteredResults(filteredData);
    } else {
      setFilteredResults(data?.items);
    }
  };

  const setSelectMedia = (media: Media) => {
    if (multiple) {
      return setSelectedMedias((prev) => {
        const value = prev.includes(media)
          ? prev.filter((i) => i !== media)
          : [...prev, media];
        return value;
      });
    }

    setSelectedMedias(selectedMedias.includes(media) ? [] : [media]);
  };

  const deleteMedias = () => {
    selectedMedias.length &&
      (async () => {
        if (confirm('Are you sure to delete selected medias?')) {
          try {
            await deleteFiles(selectedMedias.map((m) => m.id));
            await refetch();
            setSelectedMedias([]);
            toast({
              title: 'Success',
              description: 'Files deleted successfully'
            });
          } catch (e: any) {}
        }
      })();
  };
  const handleMediaUploaded = useCallback((media: Media) => {
    setUploadedMedias((prev) => {
      const isExisting = prev.some((item) => item.id === media.id);
      if (isExisting) {
        return prev;
      }
      return [media, ...prev];
    });
  }, []);

  const handleUploadComplete = useCallback(() => {
    setUploadedMedias((prev) => {
      if (prev.length > 0) {
        refetch();
        return [];
      }
      return prev;
    });
  }, [refetch]);
  if (error) return <SystemError error={error} />;

  return (
    <>
      <div className="relative h-full space-y-5">
        <div className="sticky top-0 z-10 flex flex-1 items-center justify-between rounded-lg bg-muted p-1">
          <div className="flex items-center gap-2">
            {showUploader && (
              <MediaUploader
                minimal
                onMediaUploaded={handleMediaUploaded}
                onUploadComplete={handleUploadComplete}
              />
            )}
            {onInsert && (
              <Button
                size="sm"
                onClick={() => onInsert(selectedMedias)}
                disabled={!selectedMedias.length}
              >
                Insert
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setOpenSearch(true)}
            >
              <MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <span className="text-xs">Search </span>
            </Button>
          </div>
          <div className="flex items-center gap-2 pr-2">
            <Button
              size="sm"
              variant="link"
              disabled={!selectedMedias.length}
              onClick={deleteMedias}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {selectedMedias.length
                ? `Delete selected (${selectedMedias.length})`
                : 'Delete selected'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => {
                page > 1 && setPage(page - 1);
              }}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === data?.last_page}
              onClick={() => {
                page < (data?.last_page ?? 1) && setPage(page + 1);
              }}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <div>
              <span className="text-sm text-muted-foreground">
                {page} of {data?.last_page}
              </span>
            </div>
          </div>
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="flex flex-wrap gap-5">
            {uploadedMedias.map((media) => {
              return (
                <ContextMenu key={media.id}>
                  <ContextMenuTrigger>
                    <MediaItem
                      media={media}
                      selectedMedias={selectedMedias}
                      onClick={setSelectMedia}
                    />
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-40">
                    <ContextMenuItem
                      onSelect={() => {
                        handleOpenImage(media.id);
                      }}
                    >
                      <ExternalLinkIcon className={`ml-3 size-5 flex-none`} />
                      <span className="mr-2 truncate">View</span>
                    </ContextMenuItem>
                    <ContextMenuItem
                      onSelect={() => {
                        setSelectMedia(media);
                      }}
                    >
                      <BoxSelect className={`ml-3 size-5 flex-none`} />
                      <span className="mr-2 truncate">Select</span>
                    </ContextMenuItem>
                    <ContextMenuItem
                      onSelect={async () => {
                        await copyToClipboard(media.url);
                      }}
                    >
                      <CopyIcon className={`ml-3 size-5 flex-none`} />
                      <span className="mr-2 truncate">Copy Link</span>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              );
            })}
            {(data?.items ?? []).map((media) => {
              return (
                <ContextMenu key={media.id}>
                  <ContextMenuTrigger>
                    <MediaItem
                      media={media}
                      selectedMedias={selectedMedias}
                      onClick={setSelectMedia}
                    />
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-40">
                    <ContextMenuItem
                      onSelect={() => {
                        handleOpenImage(media.id);
                      }}
                    >
                      <ExternalLinkIcon className={`ml-3 size-5 flex-none`} />
                      <span className="mr-2 truncate">View</span>
                    </ContextMenuItem>
                    <ContextMenuItem
                      onSelect={() => {
                        setSelectMedia(media);
                      }}
                    >
                      <BoxSelect className={`ml-3 size-5 flex-none`} />
                      <span className="mr-2 truncate">Select</span>
                    </ContextMenuItem>
                    <ContextMenuItem
                      onSelect={async () => {
                        await copyToClipboard(media.url);
                      }}
                    >
                      <CopyIcon className={`ml-3 size-5 flex-none`} />
                      <span className="mr-2 truncate">Copy Link</span>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              );
            })}
          </div>
        )}
      </div>
      {openImageId && selectedMedia && (
        <ImageViewer
          media={selectedMedia}
          open={openImageId !== null && true}
          onClose={handleCloseImage}
        />
      )}

      <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
        <CommandInput
          placeholder="Type a command or search..."
          value={searchInput}
          onValueChange={searchItems}
        />
        <CommandList>
          {searchInput.length > 1
            ? filteredResults &&
              filteredResults.map((media, index) => {
                return (
                  <CommandItem key={`${media.id}-${index}`} value={media.name}>
                    <div className="flex aspect-square w-20 items-center justify-center bg-slate-50 p-1">
                      {!media.type.startsWith('image/') ? (
                        fileIcon
                      ) : (
                        <img
                          className="w-20 rounded-sm object-contain object-center"
                          alt={media.name}
                          src={media.url}
                        />
                      )}
                    </div>
                    <span>{media.name}</span>
                  </CommandItem>
                );
              })
            : data?.items.map((media, index) => {
                return (
                  <CommandItem key={`${media.id}-${index}`} value={media.name}>
                    <div className="flex aspect-square w-20 items-center justify-center bg-slate-50 p-1">
                      {!media.type.startsWith('image/') ? (
                        fileIcon
                      ) : (
                        <img
                          className="w-20 rounded-sm object-contain object-center"
                          alt={media.name}
                          src={media.url}
                        />
                      )}
                    </div>
                    <span>{media.name}</span>
                  </CommandItem>
                );
              })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export const MediaItem = ({
  media,
  onClick,
  selectedMedias,
  wrapperClassName,
  hideInfo,
  onUnAttach
}: {
  media: Media;
  wrapperClassName?: string;
  selectedMedias?: Media[];
  hideInfo?: boolean;
  onClick?: (media: Media) => void;
  onUnAttach?: (media: Media) => void;
}) => {
  const selected = !!(selectedMedias ?? []).filter((m) => m.id === media.id)
    .length;
  const className = cn(
    'cursor-pointer rounded-md overflow-hidden bg-slate-100 border hover:shadow-lg',
    selected && 'border-2 border-amber-300 shadow-sm hover:shadow-amber-100'
  );

  return (
    <div
      className={cn(
        'relative flex w-full flex-wrap sm:w-full md:w-[200px] xl:w-[230px]',
        wrapperClassName
      )}
      role="none"
      onClick={() => onClick?.(media)}
    >
      {onUnAttach && (
        <div className="absolute right-1 top-1 z-10">
          <button
            type="button"
            onClick={() => onUnAttach(media)}
            className="rounded-full bg-slate-200 p-1 hover:bg-slate-300"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <div className={className}>
        <div className="flex aspect-square w-full items-center justify-center bg-slate-50 p-1">
          {!media.type.startsWith('image/') ? (
            fileIcon
          ) : (
            <img
              className="max-h-full rounded-sm object-contain object-center"
              alt={media.name}
              src={media.url}
            />
          )}
        </div>
        {!hideInfo && (
          <div className="flex-1 border-t p-3">
            <div className="space-y-1 break-words text-sm">
              <p className="text-xs text-muted-foreground">
                {media.type.split(';')[0]}
              </p>
              <h3 className="leading line-clamp-1 font-medium">{media.name}</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
