export default interface Book {
  BookID: number;
  Title: string;
  Price: string;
  file_url: string;
  cover_url: string;
  status: number;
  Description: string;
  PublisherName: string;
  PublishDate: string;
  AuthorName: string;
  isRecommend: number;
  Categories: string[];
}
