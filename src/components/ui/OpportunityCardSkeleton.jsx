const OpportunityCardSkeleton = () => (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 w-40 rounded bg-base-300 animate-pulse" />
                <div className="h-3 w-28 rounded bg-base-300 animate-pulse" />
            </div>
            <div className="h-5 w-16 rounded-full bg-base-300 animate-pulse shrink-0" />
        </div>

        {/* Skills */}
        <div className="flex gap-2">
            <div className="h-6 w-16 rounded-lg bg-base-300 animate-pulse" />
            <div className="h-6 w-20 rounded-lg bg-base-300 animate-pulse" />
            <div className="h-6 w-14 rounded-lg bg-base-300 animate-pulse" />
        </div>

        {/* Meta */}
        <div className="flex gap-4">
            <div className="h-3 w-24 rounded bg-base-300 animate-pulse" />
            <div className="h-3 w-20 rounded bg-base-300 animate-pulse" />
        </div>

        {/* CTA */}
        <div className="h-9 w-full rounded-xl bg-base-300 animate-pulse mt-auto" />
    </div>
);

export default OpportunityCardSkeleton;