import { useCallback, useEffect, useState, RefObject } from 'react';
import dayjs from 'dayjs';
import { SelectOption } from '@/types';

// 定义 AxiosError 接口，避免直接导入 axios
interface AxiosError {
  isAxiosError: boolean;
  code?: string;
  response?: {
    status?: number;
    data?: any;
  };
}

/**
 * 极简 find 实现，仅支持基本用法
 * 在数组中查找满足条件的第一个元素
 *
 * @param {Array} array - 要搜索的数组
 * @param {Function} predicate - 判断函数，接收数组元素作为参数
 * @returns {any|undefined} 找到的元素或 undefined
 *
 * @example
 * const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
 * const user = find(users, user => user.id === 2);
 * // 返回: { id: 2, name: 'Bob' }
 *
 * @description
 * - 轻量级实现，替代 lodash.find
 * - 支持任意判断函数
 * - 返回第一个匹配的元素
 * - 未找到时返回 undefined
 */
export function find(array: any, predicate: any) {
  if (!Array.isArray(array)) return undefined;
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) return array[i];
  }
  return undefined;
}

/**
 * 处理布尔值显示逻辑的辅助函数
 * @param value 布尔值或undefined或null
 * @param trueText 为true时显示的文本
 * @param falseText 为false时显示的文本
 * @returns 处理后的显示文本
 */
export const getBooleanText = (
  value: boolean | undefined | null,
  trueText: string,
  falseText: string,
): string => {
  if (value === undefined || value === null) return '-';
  return value ? trueText : falseText;
};

/**
 * 处理数字值显示逻辑的辅助函数
 * @param value 数字值或undefined或null
 * @param defaultValue 默认值，当值为undefined、null或与默认值相等时返回默认文本
 * @param defaultText 默认显示文本
 * @param formatter 可选的格式化函数，用于对非默认值进行格式化
 * @returns 处理后的显示文本
 */
export const getNumberTextWithDefault = (
  value: number | undefined | null,
  defaultValue: number,
  defaultText: string,
  formatter?: (val: number) => string,
): string => {
  if (value === undefined || value === null || value === defaultValue) {
    return defaultText;
  }
  return formatter ? formatter(value) : String(value);
};

//////////////////////////////////////////////////////////////////////////

/**
 * 动态表格高度计算 Hook 的配置参数
 */
export interface DynamicTableHeightConfig {
  /** 顶部区域（面包屑、筛选区域、动作栏）的 ref */
  topAreaRef: RefObject<HTMLElement>;
  /** 底部区域（分页栏）的 ref */
  bottomAreaRef: RefObject<HTMLElement>;
  /** 额外边距，默认 20px */
  extraMargin?: number;
  /** 最小高度，默认 200px */
  minHeight?: number;
  /** 最大高度，可选，防止表格过高 */
  maxHeight?: number;
}

/**
 * 动态表格高度计算 Hook 的返回值
 */
export interface DynamicTableHeightResult {
  /** 计算后的表格滚动高度 */
  tableScrollHeight: string;
  /** 手动触发重新计算的函数 */
  calculateTableHeight: () => number;
}

/**
 * 动态表格高度计算 Hook
 * 自动计算表格的可用高度，支持响应式调整
 *
 * @param config 配置参数
 * @returns 表格高度和计算函数
 */
export const useDynamicTableHeight = (
  config: DynamicTableHeightConfig,
): DynamicTableHeightResult => {
  const { topAreaRef, bottomAreaRef, extraMargin = 20, minHeight = 200, maxHeight } = config;

  const [tableScrollHeight, setTableScrollHeight] = useState<string>('calc(100vh - 450px)');

  // 计算表格高度的核心逻辑
  const calculateTableHeight = useCallback(() => {
    try {
      const topHeight = topAreaRef.current?.offsetHeight || 0;
      const bottomHeight = bottomAreaRef.current?.offsetHeight || 0;

      const availableHeight = window.innerHeight - topHeight - bottomHeight - extraMargin;

      // 应用最小和最大高度限制
      let finalHeight = Math.max(availableHeight, minHeight);
      if (maxHeight !== undefined) {
        finalHeight = Math.min(finalHeight, maxHeight);
      }

      return finalHeight;
    } catch (error) {
      console.warn('动态高度计算失败:', error);
      return minHeight;
    }
  }, [topAreaRef, bottomAreaRef, extraMargin, minHeight, maxHeight]);

  // 更新表格高度的函数
  const updateTableHeight = useCallback(() => {
    const height = calculateTableHeight();
    setTableScrollHeight(`${height}px`);
  }, [calculateTableHeight]);

  // 监听顶部和底部区域尺寸变化
  useEffect(() => {
    const resizeObserver = new ResizeObserver(updateTableHeight);

    if (topAreaRef.current) {
      resizeObserver.observe(topAreaRef.current);
    }
    if (bottomAreaRef.current) {
      resizeObserver.observe(bottomAreaRef.current);
    }

    // 初始计算
    updateTableHeight();

    return () => {
      resizeObserver.disconnect();
    };
  }, [topAreaRef, bottomAreaRef, updateTableHeight]);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      updateTableHeight();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateTableHeight]);

  return {
    tableScrollHeight,
    calculateTableHeight,
  };
};

//////////////////////////////////////////////////////////////////////////

/**
 * 格式化日期时间
 * @param dateTime 日期时间值
 * @param defaultText 默认显示文本，当日期无效时返回
 * @returns 格式化后的日期时间字符串
 */
export const formatDateTime = (dateTime: any, defaultText: string = ''): string => {
  if (!dateTime) return defaultText;
  if (typeof dateTime === 'string') {
    return dateTime;
  }
  try {
    const dateObj = dayjs.isDayjs(dateTime) ? dateTime : dayjs(dateTime);
    return dateObj.isValid() ? dateObj.format('YYYY-MM-DD HH:mm:ss') : defaultText;
  } catch (error) {
    console.warn('格式化日期时间失败:', error, '原始值:', dateTime);
    return defaultText;
  }
};

/**
 * 格式化日期显示
 * @param date 日期
 * @param format 日期格式，默认为YYYY-MM-DD
 * @param defaultValue 默认显示值，当日期为空时显示
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
  date: string | Date | dayjs.Dayjs | null | undefined,
  format: string = 'YYYY-MM-DD',
  defaultValue: string = '-',
): string => {
  if (!date) return defaultValue;
  try {
    return dayjs(date).format(format);
  } catch {
    return defaultValue;
  }
};

/**
 * 格式化金额显示
 * @param amount 金额字符串或数字
 * @param defaultValue 默认显示值，当金额为空或0时显示
 * @returns 格式化后的金额字符串
 */
export const formatAmount = (
  amount: string | number | null | undefined,
  defaultValue: string = '-',
): string => {
  if (!amount || amount === '0') return defaultValue;
  return `${amount}元`;
};

/**
 * 根据值查找选项标签
 * @param value 选项值
 * @param options 选项数组
 * @param defaultText 默认显示文本，当值不存在时返回
 * @returns 选项标签，如果未找到则返回原值
 */
export const getOptionLabel = (
  value: string | number,
  options: SelectOption[],
  defaultText: string = '',
): string => {
  if (!value) return defaultText;
  const option = options.find((opt) => opt.value === value);
  return option ? option.label : String(value);
};

/**
 * 将选项数组转换为ProTable的valueEnum格式
 * @param options 选项数组
 * @returns ProTable的valueEnum对象
 */
export const createValueEnum = (options: SelectOption[]): Record<string, { text: string }> => {
  return options.reduce(
    (acc, option) => {
      acc[option.value] = { text: option.label };
      return acc;
    },
    {} as Record<string, { text: string }>,
  );
};

//////////////////////////////////////////////////////////////////////////

/**
 * 获取错误消息的实用方法
 * @param error 错误对象
 * @returns 格式化后的错误消息字符串
 */
export const getErrorMessage = (error: any): string => {
  // 检查是否为 AxiosError
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError;

    // 检查错误条件
    if (
      axiosError.code === 'ERR_BAD_RESPONSE' &&
      axiosError.response?.status === 500 &&
      axiosError.response?.data &&
      typeof axiosError.response.data === 'object' &&
      'message' in axiosError.response.data &&
      axiosError.response.data.message
    ) {
      return String(axiosError.response.data.message);
    }
  }

  // 其他情况返回错误的字符串表示
  return String(error);
};

//////////////////////////////////////////////////////////////////////////

/**
 * 通用API响应处理函数
 * 统一处理后端API响应的成功和错误情况
 *
 * @param response API响应对象
 * @param successCallback 成功回调函数，接收响应数据
 * @param errorCallback 错误回调函数，接收错误消息
 * @param defaultErrorMessage 默认错误信息
 *
 * @example
 * ```typescript
 * handleApiResponse(
 *   response,
 *   (data) => setData(data),
 *   (message) => setError(message),
 *   '操作失败'
 * );
 * ```
 */
export const handleApiResponse = <T>(
  response: { code?: string; data: T | null; message?: string },
  successCallback: (data: T | null) => void,
  errorCallback: (message: string) => void,
  defaultErrorMessage: string,
): void => {
  if (response.code === '0') {
    successCallback(response.data);
  } else {
    // 处理业务错误
    errorCallback(response.message || defaultErrorMessage);
  }
};
