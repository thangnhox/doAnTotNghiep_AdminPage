export interface ResponseDTO<T> {
  message: string;
  data: T;
  total?: number | undefined;
  page?: number | undefined;
  pageSize?: number | undefined;
}
