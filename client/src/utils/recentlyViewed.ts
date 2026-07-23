const STORAGE_KEY = "mz_recently_viewed";
const MAX_ITEMS = 8;

export interface RecentlyViewedProduct {
  id: number;
  title: string;
  productImage: string;
  price: number;
  discountPrice?: number;
  isOnSale?: boolean;
  slug?: string;
}

export const addRecentlyViewed = (product: RecentlyViewedProduct) => {
  try {
    const list = getRecentlyViewed();
    const next = [product, ...list.filter((p) => p.id !== product.id)].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable (private browsing, storage full, etc) — skip silently
  }
};

export const getRecentlyViewed = (excludeId?: number): RecentlyViewedProduct[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: RecentlyViewedProduct[] = raw ? JSON.parse(raw) : [];
    return excludeId ? list.filter((p) => p.id !== excludeId) : list;
  } catch {
    return [];
  }
};
