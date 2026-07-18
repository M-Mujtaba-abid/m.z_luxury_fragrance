export interface Review {
  id: number;
  userId: number;
  productId: number;
  orderId: number;
  rating: number;
  comment: string | null;
  images: string[];
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  User?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  Product?: {
    id: number;
    title: string;
    productImage: string;
  };
}

export interface RatingBreakdownRow {
  star: number;
  count: number;
  percentage: number;
}

export interface ProductReviewsResult {
  reviews: Review[];
  page: number;
  limit: number;
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: RatingBreakdownRow[];
}

// A delivered order-item that doesn't have a review yet — drives the
// "Write a Review" button on the order history page.
export interface EligibleOrderItem {
  orderId: number;
  orderItemId: number;
  productId: number;
  productTitle: string;
  productImage: string;
  deliveredOn: string;
}

export interface SubmitReviewData {
  orderId: number;
  productId: number;
  rating: number;
  comment?: string;
  images?: File[];
}
