/**
 * 分页参数类型。
 */
export type PageParams = {
  pageNum: number;
  pageSize: number;
  sortColumn?: string;
  sortOrder?: "asc" | "desc";
};

/**
 * 分页数据类型。
 */
export type PageData<T> = {
  pageNum: number;
  pageSize: number;
  total: number;
  list: T[];
};
