export interface CommonResultType<T = any> {
  code: number;
  message: string;
  data: T;
}
export type SelectTreeItem<T = string> = {
  label: string;
  value: T;
  disabled?: boolean;
  children?: SelectTreeItem<T>[];
};
