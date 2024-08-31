import { cn } from '@/lib/utils';
import { AlertOctagon } from 'lucide-react';
import Head from 'next/head';

export interface LoadingProps {
  title?: string;
  description?: string;
  error?: string;
  full?: boolean;
  className?: string;
}
export const Loading = ({
  title,
  description,
  error,
  full,
  className
}: LoadingProps) => {
  if (error) {
    title = 'Error';
    description = error;
  }

  const wrapperClassName = cn(
    'z-50 bg-slate-100 opacity-75 flex flex-col items-center justify-center rounded-lg',
    className ?? '',
    full
      ? 'fixed top-0 left-0 right-0 bottom-0 w-full h-screen'
      : 'w-full h-full'
  );

  return (
    <>
      <Head>
        <title>{title ?? 'Loading...'}</title>
      </Head>
      <div className={wrapperClassName}>
        {error ? (
          <AlertOctagon size={64} color="#dc2626" />
        ) : (
          <div className="loader mb-4 h-12 w-12 rounded-full border-4 border-t-4 border-gray-100 ease-linear"></div>
        )}
        <h2 className="text-center text-xl font-semibold text-black">
          {title ?? 'Loading...'}
        </h2>
        <p className="w-1/3 text-center text-black">
          {description ??
            "This may take a few seconds, please don't close this page."}
        </p>
      </div>
    </>
  );
};
