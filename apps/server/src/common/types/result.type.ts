export interface CommonResultType<T = any> {
  code: number;
  message: string;
  data: T;
}
