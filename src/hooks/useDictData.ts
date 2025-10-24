import { getDictsByCodeNoList } from '@/services/dict/dict';
import { DictDataMap, DictItem } from '@/types/dict';
import { message } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * ProTable valueEnum 类型定义
 */
export type ValueEnum = Record<string, { text: string; value: string }>;

interface UseDictDataReturn {
  dictData: DictDataMap;
  loading: boolean;
  loadDictData: (codeNoList: string[]) => Promise<void>;
  getDictOptions: (codeNo: string) => DictItem[];
  getDictValueEnum: (codeNo: string) => ValueEnum;
  refreshDictData: () => Promise<void>;
}

/**
 * 字典数据管理Hook
 * 提供批量加载、缓存和获取字典数据的功能
 */
export const useDictData = (initialCodeList: string[] = []): UseDictDataReturn => {
  const [dictData, setDictData] = useState<DictDataMap>({});
  const [loading, setLoading] = useState(false);
  const [codeList, setCodeList] = useState<string[]>(initialCodeList);
  const initializedRef = useRef(false);

  // 批量加载字典数据
  const loadDictData = useCallback(async (codeNoList: string[]) => {
    if (!codeNoList || codeNoList.length === 0) {
      return;
    }

    try {
      setLoading(true);
      const result = await getDictsByCodeNoList(codeNoList);
      setDictData((prev) => ({
        ...prev,
        ...result.data,
      }));
    } catch (error) {
      console.error('加载字典数据失败:', error);
      message.error('加载字典数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 刷新字典数据
  const refreshDictData = useCallback(async () => {
    if (codeList.length > 0) {
      await loadDictData(codeList);
    }
  }, [codeList, loadDictData]);

  // 获取指定代码的字典选项
  const getDictOptions = useCallback(
    (codeNo: string): DictItem[] => {
      return dictData[codeNo] || [];
    },
    [dictData],
  );

  // 获取指定代码的字典选项，转换为 ProTable valueEnum 格式
  const getDictValueEnum = useCallback(
    (codeNo: string): ValueEnum => {
      const options = dictData[codeNo] || [];
      return options.reduce((acc, option) => {
        acc[option.itemNo] = {
          text: option.itemDescribe,
          value: option.itemNo,
        };
        return acc;
      }, {} as ValueEnum);
    },
    [dictData],
  );

  // 初始化加载 - 使用useRef避免重复执行
  useEffect(() => {
    if (!initializedRef.current && initialCodeList.length > 0) {
      initializedRef.current = true;
      setCodeList(initialCodeList);

      // 直接调用API
      const loadInitialData = async () => {
        try {
          setLoading(true);
          const result = await getDictsByCodeNoList(initialCodeList);
          setDictData(result.data || {});
        } catch (error) {
          console.error('加载字典数据失败:', error);
          message.error('加载字典数据失败');
        } finally {
          setLoading(false);
        }
      };
      loadInitialData();
    }
  }, []); // 空依赖数组，只在组件挂载时执行一次

  return {
    dictData,
    loading,
    loadDictData,
    getDictOptions,
    getDictValueEnum,
    refreshDictData,
  };
};
