/**
 * 字典项接口定义
 */
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

/**
 * 字典数据映射类型
 */
export type DictDataMap = Record<string, DictItem[]>;
