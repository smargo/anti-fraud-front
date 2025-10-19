import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';

interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

interface UsePaginationOptions {
  defaultPageSize?: number;
  defaultCurrent?: number;
}

export const usePagination = (options: UsePaginationOptions = {}) => {
  const { defaultPageSize = 10, defaultCurrent = 1 } = options;

  const [pagination, setPagination] = useState<PaginationState>({
    current: defaultCurrent,
    pageSize: defaultPageSize,
    total: 0,
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const fetchData = useCallback(
    async (fetchFunction: (params: any) => Promise<any>, searchParams?: any) => {
      setLoading(true);
      try {
        const { current, pageSize } = pagination;
        const response = await fetchFunction({
          ...searchParams,
          current: current,
          pageSize,
        });

        // 处理后端返回的数据结构
        if (response && typeof response === 'object') {
          if ('records' in response) {
            // MyBatis-Plus Page 对象结构 { records: [], total: number }
            setData(response.records || []);
            setPagination((prev) => ({
              ...prev,
              total: response.total || 0,
            }));
          } else if ('list' in response) {
            // 自定义分页结构 { list: [], total: number }
            setData(response.list || []);
            setPagination((prev) => ({
              ...prev,
              total: response.total || 0,
            }));
          } else if (Array.isArray(response)) {
            // 后端直接返回数组（兼容旧格式）
            setData(response);
            setPagination((prev) => ({
              ...prev,
              total: response.length,
            }));
          } else {
            setData([]);
            setPagination((prev) => ({
              ...prev,
              total: 0,
            }));
          }
        } else {
          setData([]);
          setPagination((prev) => ({
            ...prev,
            total: 0,
          }));
        }
      } catch (error) {
        message.error('获取数据失败');
        console.log(error);
        setData([]);
        setPagination((prev) => ({
          ...prev,
          total: 0,
        }));
      } finally {
        setLoading(false);
      }
    },
    [pagination.current, pagination.pageSize],
  );

  const handleTableChange = useCallback((page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
  }, []);

  const resetToFirstPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  }, []);

  return {
    pagination,
    loading,
    data,
    setData,
    fetchData,
    handleTableChange,
    resetToFirstPage,
    setPagination,
  };
};
