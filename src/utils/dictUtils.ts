/**
 * 字典工具函数
 * 提供字典相关的工具函数
 */

// 字典类型定义
export interface DictItem {
  id: number;
  codeNo: string;
  itemNo: string;
  itemValue: string;
  itemDescribe: string;
  sortNo: number;
  status: string;
  listClass: string;
}

export interface DictData {
  [key: string]: {
    text: string;
    status?: string;
  };
}

export type ValueEnum = Record<string, { text: string; value: string; status?: string }>;

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
      status: option.listClass,
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
  return options.map((option) => ({
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
  const option = options.find((opt) => opt.itemNo === itemNo);
  return option ? option.itemDescribe : itemNo;
};
