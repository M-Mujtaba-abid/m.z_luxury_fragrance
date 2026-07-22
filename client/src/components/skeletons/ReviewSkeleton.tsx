const ReviewSkeleton = () => {
    return (
        <div className="mt-12 animate-pulse">
            <div className="h-8 w-48 bg-luxury-card rounded mb-8" />

            {[...Array(3)].map((_, index) => (
                <div
                    key={index}
                    className="mb-6 rounded-2xl border border-luxury-gold/10 bg-luxury-card p-6"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-luxury-card/70" />

                        <div className="flex-1">
                            <div className="h-4 w-32 rounded bg-luxury-card/70 mb-2" />
                            <div className="h-3 w-20 rounded bg-luxury-card/70" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="h-3 rounded bg-luxury-card/70" />
                        <div className="h-3 rounded bg-luxury-card/70 w-11/12" />
                        <div className="h-3 rounded bg-luxury-card/70 w-9/12" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewSkeleton;