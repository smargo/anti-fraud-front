// 后端API响应格式
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

// 通用API响应
export interface ResultPage<T = any> {
  success: boolean;
  total: number;
  data?: T[];
}
