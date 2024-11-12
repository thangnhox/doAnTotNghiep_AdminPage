export default interface BookRequest {
  title: string;
  description: string;
  pageCount: number;
  price: string;
  fileUrl: string;
  coverUrl: string;
  status: number;
  authorId: number;
  publisherId: number;
  publishDate: Date;
  isRecommended: boolean;
  categoryId: number;
}
