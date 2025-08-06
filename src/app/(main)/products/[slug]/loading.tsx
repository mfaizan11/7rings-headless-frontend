export default function ProductLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square w-full rounded-lg bg-neutral-200 dark:bg-neutral-800"></div>

      {/* Details Skeleton */}
      <div className="flex flex-col gap-4 py-4">
        <div className="h-10 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700"></div>
        <div className="h-8 w-1/4 rounded bg-neutral-200 dark:bg-neutral-700"></div>
        <div className="mt-4 space-y-3">
          <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-700"></div>
          <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-700"></div>
          <div className="h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-700"></div>
        </div>
      </div>
    </div>
  );
}