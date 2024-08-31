import { Button } from '@/components/common/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { sleep } from '@/lib/helper';
import { uploadFile } from '@/lib/media';
import { cn } from '@/lib/utils';
import { Media } from '@/types';
import { BadgeAlert, UploadCloud } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { MediaPreviewer } from './preview';

export interface MediaUploaderProps {
  uploadContainerClass?: string;
  minimal?: boolean;
  onMediaUploaded?: (file: Media) => void;
  onUploadComplete?: () => void;
}

export const MediaUploader = (props: MediaUploaderProps) => {
  const {
    uploadContainerClass,
    minimal,
    onMediaUploaded: onFileUploaded,
    onUploadComplete
  } = props;
  const [statuses, setStatuses] = useState<Record<number, string>>({});
  const [progress, setProgress] = useState('');
  const [errorFiles, setErrorFiles] = useState<string[]>([]);
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone();

  useEffect(() => {
    if (!acceptedFiles.length) {
      return;
    }

    (async () => {
      let success = 0;
      for (let i = 0; i < acceptedFiles.length; i++) {
        try {
          setStatuses((prev) => ({ ...prev, [i]: 'uploading' }));
          const result = await uploadFile(acceptedFiles[i]);

          result.length
            ? setStatuses((prev) => ({ ...prev, [i]: 'success' }))
            : setStatuses((prev) => ({ ...prev, [i]: 'error' }));
          success++;
          setProgress(`${success}/${acceptedFiles.length}`);
          onFileUploaded?.(result?.[0]);
        } catch (e: any) {
          setStatuses((prev) => ({
            ...prev,
            [i]: e.message ?? 'Unknown error'
          }));
          setErrorFiles((prev) => [
            ...prev,
            `${acceptedFiles[i].name}: ${e.message ?? 'Unknown error'}`
          ]);
        }
      }
      await sleep(1000);
      onUploadComplete?.();
    })();
  }, [acceptedFiles, onFileUploaded, onUploadComplete]);

  return (
    <div className="space-y-5">
      {!minimal ? (
        <div
          {...getRootProps()}
          className={cn(
            'dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600',
            uploadContainerClass
          )}
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <UploadCloud className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              {isDragActive
                ? 'Drop the files here ...'
                : 'Drag and drop some files here, or click to select files'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG, GIF, PDF, DOCX, XLSX...
            </p>
          </div>
          <input
            {...getInputProps()}
            id="dropzone-file"
            type="file"
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex flex-row items-center space-x-2 align-middle">
          <div {...getRootProps()}>
            <input {...getInputProps()} type="file" className="hidden" />
            <Button size="sm" variant="outline">
              <UploadCloud className="mr-2 h-4 w-4" />
              <span>Upload</span>
            </Button>
          </div>
          {progress && (
            <div className="flex flex-row items-center gap-1 align-middle text-sm">
              <span>{progress}</span>
              {!!errorFiles.length && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <BadgeAlert className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      {errorFiles.map((m) => (
                        <p key={m} className="text-red-600 dark:text-red-400">
                          {m}
                        </p>
                      ))}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}
        </div>
      )}

      {!minimal && !!acceptedFiles.length ? (
        <div className="w-full">
          <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <TableHeader className="bg-gray-50 dark:bg-gray-700">
              <TableRow className="text-gray-800 dark:text-gray-300">
                <TableHead
                  scope="col"
                  className="p-3.5 px-2 text-start text-sm font-semibold"
                ></TableHead>
                <TableHead
                  scope="col"
                  className="min-w-[10rem] p-3.5 px-2 text-start text-sm font-semibold"
                >
                  Name
                </TableHead>
                <TableHead
                  scope="col"
                  className="min-w-[10rem] p-3.5 px-2 text-start text-sm font-semibold"
                >
                  Type
                </TableHead>
                <TableHead
                  scope="col"
                  className="min-w-[6rem] p-3.5 px-2 text-start text-sm font-semibold"
                >
                  Size
                </TableHead>
                <TableHead
                  scope="col"
                  className="min-w-[6rem] p-3.5 px-2 text-start text-sm font-semibold"
                >
                  Status
                </TableHead>
                <TableHead
                  scope="col"
                  className="min-w-[8rem] p-3.5 px-2 text-start text-sm font-semibold"
                >
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200 dark:divide-gray-600">
              {acceptedFiles.map((file, k) => {
                const status = statuses[k] ?? 'pending';
                return (
                  <TableRow key={file.name}>
                    <TableCell className="flex max-w-[50px] items-center p-2">
                      <MediaPreviewer file={file} />
                    </TableCell>
                    <TableCell className="p-2 text-sm font-medium text-gray-700 dark:text-gray-400">
                      {file.name}
                    </TableCell>
                    <TableCell className="p-2 text-sm text-gray-700 dark:text-gray-400">
                      <p>{file.type}</p>
                    </TableCell>
                    <TableCell className="p-2 text-sm text-gray-700 dark:text-gray-400">
                      {file.size} bytes
                    </TableCell>
                    <TableCell className="p-2 text-sm text-gray-700 dark:text-gray-400">
                      {status}
                    </TableCell>
                    <TableCell className="p-2 text-sm text-gray-700 dark:text-gray-400">
                      {status === 'success' && (
                        <div className="flex h-full w-full items-center justify-center space-x-2 text-sm">
                          <a
                            href="/link-to-file"
                            className="text-blue-800 hover:underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            View
                          </a>
                          <button
                            className="cursor-pointer text-red-800 hover:underline"
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
};
