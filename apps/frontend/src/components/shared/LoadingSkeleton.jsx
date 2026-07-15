export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) =>
      <div key={i} className="glass-card p-5 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl skeleton flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 skeleton rounded w-20" />
              <div className="h-4 skeleton rounded w-3/4" />
              <div className="h-3 skeleton rounded w-1/2" />
              <div className="h-3 skeleton rounded" />
              <div className="h-3 skeleton rounded w-5/6" />
            </div>
          </div>
        </div>
      )}
    </div>);

}