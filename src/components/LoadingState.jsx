import { Loader } from 'lucide-react';

export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-[#5b657a]">
      <Loader className="w-8 h-8 animate-spin text-teal-700" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-[#e6e1d8] bg-white overflow-hidden animate-pulse"
        >
          <div className="aspect-video bg-[#ece7df]" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-[#ece7df] rounded w-3/4" />
            <div className="h-3 bg-[#ece7df] rounded w-1/2" />
            <div className="h-3 bg-[#ece7df] rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
