/**
 * 字典工具函数
 * 提供字典数据相关的通用工具方法
 */

import { DictItem } from '@/types/dict';
import { ValueEnum } from '@/hooks/useDictData';

/**
 * 将字典选项转换为 ProTable valueEnum 格式
 * @param options 字典选项数组
 * @returns ProTable valueEnum 格式的对象
 */
export const convertDictToValueEnum = (options: DictItem[]): ValueEnum => {
  return options.reduce((acc, option) => {
    acc[option.itemNo] = {
      text: option.itemDescribe,
      value: option.itemNo,
      status: option.listClass
    };
    return acc;
  }, {} as ValueEnum);
};

/**
 * 将字典选项转换为 Select 组件的 options 格式
 * @param options 字典选项数组
 * @returns Select.Option 格式的数组
 */
export const convertDictToSelectOptions = (options: DictItem[]) => {
  return options.map(option => ({
    label: option.itemDescribe,
    value: option.itemNo,
    key: option.itemNo,
  }));
};

/**
 * 根据字典代码获取对应的显示文本
 * @param options 字典选项数组
 * @param itemNo 字典项代码
 * @returns 显示文本，如果找不到则返回原代码
 */
export const getDictText = (options: DictItem[], itemNo: string): string => {
  const option = options.find(opt => opt.itemNo === itemNo);
  return option ? option.itemDescribe : itemNo;
};
