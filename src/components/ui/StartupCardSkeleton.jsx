const StartupCardSkeleton = () => (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-5 flex flex-col gap-4">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-base-300 animate-pulse shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 w-32 rounded bg-base-300 animate-pulse" />
                <div className="h-3 w-24 rounded bg-base-300 animate-pulse" />
            </div>
            <div className="h-5 w-16 rounded-full bg-base-300 animate-pulse" />
        </div>
        <div className="flex flex-col gap-2">
            <div className="h-3 w-full rounded bg-base-300 animate-pulse" />
            <div className="h-3 w-4/5 rounded bg-base-300 animate-pulse" />
        </div>
        <div className="h-3 w-20 rounded bg-base-300 animate-pulse" />
        <div className="h-9 w-full rounded-xl bg-base-300 animate-pulse mt-auto" />
    </div>
);

export default StartupCardSkeleton;