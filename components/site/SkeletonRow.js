export default function SkeletonRow({ title }) {
  return (
    <section className="mt-10">
      <div className="px-4 md:px-8 mb-3"><div className="h-6 w-40 skeleton rounded" /></div>
      <div className="flex gap-4 px-4 md:px-8 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-40 sm:w-44 md:w-48 lg:w-52 shrink-0">
            <div className="aspect-poster skeleton rounded-xl" />
            <div className="mt-2 h-4 w-3/4 skeleton rounded" />
            <div className="mt-1 h-3 w-1/3 skeleton rounded" />
          </div>
        ))}
      </div>
    </section>
  )
}
