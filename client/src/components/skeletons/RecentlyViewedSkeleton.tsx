const RecentlyViewedSkeleton = () => {
    return (
        <div className="mt-16">
            <div className="h-8 w-56 rounded bg-luxury-card animate-pulse mb-8" />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className="rounded-2xl overflow-hidden border border-luxury-gold/10 bg-luxury-card animate-pulse"
                    >
                        <div className="aspect-[4/5] bg-luxury-card/70" />

                        <div className="p-4 space-y-3">
                            <div className="h-4 rounded bg-luxury-card/70" />
                            <div className="h-3 w-2/3 rounded bg-luxury-card/70" />
                            <div className="h-5 w-20 rounded bg-luxury-card/70" />

                            <div className="h-10 rounded-xl bg-luxury-card/70" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewedSkeleton;