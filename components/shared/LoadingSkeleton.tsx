export function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4 w-full max-w-md p-8">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
      </div>
    </div>
  );
}
