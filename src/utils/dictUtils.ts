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
 * 字典工具类
 */
export class DictUtils {
  /**
   * 将字典数据转换为选项数组
   * @param dictData 字典数据
   * @returns 选项数组
   */
  static dictToOptions(dictData: DictData): Array<{ value: string; label: string; disabled?: boolean }> {
    return Object.entries(dictData).map(([value, item]) => ({
      value,
      label: item.text,
      disabled: item.status === 'disabled',
    }));
  }

  /**
   * 将选项数组转换为字典数据
   * @param options 选项数组
   * @returns 字典数据
   */
  static optionsToDict(options: Array<{ value: string; label: string; disabled?: boolean }>): DictData {
    const dict: DictData = {};
    options.forEach((option) => {
      dict[option.value] = {
        text: option.label,
        status: option.disabled ? 'disabled' : 'active',
      };
    });
    return dict;
  }

  /**
   * 根据值获取标签
   * @param value 值
   * @param dictData 字典数据
   * @param defaultValue 默认值
   * @returns 标签
   */
  static getLabelByValue(
    value: string | number,
    dictData: DictData,
    defaultValue: string = '-',
  ): string {
    const item = dictData[value];
    return item ? item.text : defaultValue;
  }

  /**
   * 根据标签获取值
   * @param label 标签
   * @param dictData 字典数据
   * @returns 值
   */
  static getValueByLabel(label: string, dictData: DictData): string | number | undefined {
    const entry = Object.entries(dictData).find(([, item]) => item.text === label);
    return entry ? entry[0] : undefined;
  }

  /**
   * 过滤字典数据
   * @param dictData 字典数据
   * @param filterFn 过滤函数
   * @returns 过滤后的字典数据
   */
  static filterDict(
    dictData: DictData,
    filterFn: (value: string, item: { text: string; status?: string }) => boolean,
  ): DictData {
    const filtered: DictData = {};
    Object.entries(dictData).forEach(([value, item]) => {
      if (filterFn(value, item)) {
        filtered[value] = item;
      }
    });
    return filtered;
  }

  /**
   * 合并字典数据
   * @param dict1 字典数据1
   * @param dict2 字典数据2
   * @returns 合并后的字典数据
   */
  static mergeDict(dict1: DictData, dict2: DictData): DictData {
    return { ...dict1, ...dict2 };
  }

  /**
   * 排序字典数据
   * @param dictData 字典数据
   * @param sortFn 排序函数
   * @returns 排序后的字典数据
   */
  static sortDict(
    dictData: DictData,
    sortFn?: (
      a: [string, { text: string; status?: string }],
      b: [string, { text: string; status?: string }],
    ) => number,
  ): DictData {
    const entries = Object.entries(dictData);
    const sorted = entries.sort(sortFn || ((a, b) => a[1].text.localeCompare(b[1].text)));

    const sortedDict: DictData = {};
    sorted.forEach(([value, item]) => {
      sortedDict[value] = item;
    });

    return sortedDict;
  }

  /**
   * 检查字典数据是否为空
   * @param dictData 字典数据
   * @returns 是否为空
   */
  static isEmpty(dictData: DictData): boolean {
    return Object.keys(dictData).length === 0;
  }

  /**
   * 获取字典数据的键
   * @param dictData 字典数据
   * @returns 键数组
   */
  static getKeys(dictData: DictData): string[] {
    return Object.keys(dictData);
  }

  /**
   * 获取字典数据的值
   * @param dictData 字典数据
   * @returns 值数组
   */
  static getValues(dictData: DictData): { text: string; status?: string }[] {
    return Object.values(dictData);
  }

  /**
   * 获取字典数据的条目
   * @param dictData 字典数据
   * @returns 条目数组
   */
  static getEntries(dictData: DictData): Array<[string, { text: string; status?: string }]> {
    return Object.entries(dictData);
  }

  /**
   * 创建字典数据
   * @param data 原始数据
   * @param valueField 值字段
   * @param labelField 标签字段
   * @returns 字典数据
   */
  static createDict<T extends Record<string, any>>(
    data: T[],
    valueField: keyof T,
    labelField: keyof T,
  ): DictData {
    const dict: DictData = {};
    data.forEach((item) => {
      const value = String(item[valueField]);
      const label = String(item[labelField]);
      dict[value] = { text: label };
    });
    return dict;
  }

  /**
   * 更新字典数据
   * @param dictData 字典数据
   * @param value 值
   * @param item 条目
   * @returns 更新后的字典数据
   */
  static updateDict(
    dictData: DictData,
    value: string | number,
    item: { text: string; status?: string },
  ): DictData {
    return {
      ...dictData,
      [value]: item,
    };
  }

  /**
   * 删除字典数据
   * @param dictData 字典数据
   * @param value 值
   * @returns 删除后的字典数据
   */
  static removeFromDict(dictData: DictData, value: string | number): DictData {
    const newDict = { ...dictData };
    delete newDict[value];
    return newDict;
  }

  /**
   * 将字典数据转换为 ProTable 的 valueEnum 格式
   * @param dictData 字典数据
   * @returns ProTable 的 valueEnum 对象
   */
  static convertDictToValueEnum(
    dictData: DictData,
  ): Record<string, { text: string; status?: string }> {
    return dictData;
  }

  /**
   * 根据值获取字典文本（兼容性函数）
   * @param value 值
   * @param dictData 字典数据
   * @param defaultValue 默认值
   * @returns 字典文本
   */
  static getDictText(
    value: string,
    dictData: DictData,
    defaultValue: string = '-',
  ): string {
    return DictUtils.getLabelByValue(value, dictData, defaultValue);
  }

  /**
   * 将字典数据转换为下拉框选项（兼容性函数）
   * @param dictData 字典数据
   * @returns 下拉框选项数组
   */
  static convertDictToSelectOptions(
    dictData: DictData,
  ): Array<{ label: string; value: string | number }> {
    return Object.entries(dictData).map(([value, item]) => ({
      label: item.text,
      value: value,
    }));
  }
}

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

// 兼容性导出
export const dictToOptions = DictUtils.dictToOptions;
export const optionsToDict = DictUtils.optionsToDict;
export const getLabelByValue = DictUtils.getLabelByValue;
export const getValueByLabel = DictUtils.getValueByLabel;
export const filterDict = DictUtils.filterDict;
export const mergeDict = DictUtils.mergeDict;
export const sortDict = DictUtils.sortDict;
export const isEmptyDict = DictUtils.isEmpty;
export const getDictKeys = DictUtils.getKeys;
export const getDictValues = DictUtils.getValues;
export const getDictEntries = DictUtils.getEntries;
export const createDict = DictUtils.createDict;
export const updateDict = DictUtils.updateDict;
export const removeFromDict = DictUtils.removeFromDict;
