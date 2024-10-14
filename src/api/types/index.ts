// 接口响应统一格式
export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
  status: boolean;
}

// 泛型的分页数据响应格式
export interface PageDataResponse<T> {
  countId: null | string; // 假设它可能为null或string类型
  current: number; // 当前页
  maxLimit: null | number; // 假设最大限制可能为 null 或 number
  optimizeCountSql: boolean; // 是否优化计数 SQL
  orders: any[]; // 排序规则，可以根据实际需求调整类型
  pages: number; // 总页数
  records: T[]; // 泛型，表示数据记录的数组
  searchCount: boolean; // 是否计算总数
  size: number; // 每页显示的记录数
  total: number; // 总记录数
}
