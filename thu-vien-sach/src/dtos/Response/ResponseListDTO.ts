export default interface ResponseListDTO<T> {
  message: string;
  data: T;
  total: number | undefined;
  page: number | undefined;
  pageSize: number | undefined;
}
