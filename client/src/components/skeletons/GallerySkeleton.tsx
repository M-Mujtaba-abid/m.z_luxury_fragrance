const GallerySkeleton = () => {
    return (
        <div className="animate-pulse">
            {/* Main Image */}
            <div className="aspect-square w-full rounded-3xl overflow-hidden bg-luxury-card border border-luxury-gold/10">
                <div className="w-full h-full bg-gradient-to-br from-luxury-card via-luxury-card/70 to-luxury-card" />
            </div>

            {/* Thumbnails */}
            <div className="mt-4 grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="aspect-square rounded-xl bg-luxury-card border border-luxury-gold/10"
                    />
                ))}
            </div>
        </div>
    );
};

export default GallerySkeleton;