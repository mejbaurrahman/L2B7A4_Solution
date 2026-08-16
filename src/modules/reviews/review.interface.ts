export interface CreateReviewData {
  bookingId: string;
  userId: string;
  rating: number;
  comment?: string;
}
