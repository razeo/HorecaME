export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 h-8 w-48 animate-pulse rounded bg-surface-raised" />
      <div className="mb-4 h-4 w-64 animate-pulse rounded bg-surface-raised" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl bg-surface-raised">
            <div className="aspect-square rounded-t-xl bg-surface" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-20 rounded bg-surface" />
              <div className="h-4 w-full rounded bg-surface" />
              <div className="h-4 w-2/3 rounded bg-surface" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
