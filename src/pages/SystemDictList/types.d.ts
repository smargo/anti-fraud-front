/**
 * SystemDictList 页面类型定义
 */

export interface SystemDictItem {
  id?: number;
  codeNo?: string; // 代码编号
  itemNo?: string; // 代码项编号
  itemValue?: string; // 代码项值
  otherNo?: string; // 其他映射代码
  sortNo?: number; // 排序编号
  status?: string; // 是否启用 (Y/N)
  itemDescribe?: string; // 代码描述
  listClass?: string; // 展示类别
  createdDate?: string; // 创建时间
  createdBy?: string; // 创建人
  lastModifiedDate?: string; // 最后修改时间
  lastModifiedBy?: string; // 最后修改人
}

export interface SystemDictFormValues {
  codeNo: string;
  itemNo: string;
  itemValue: string;
  otherNo?: string;
  sortNo?: number;
  status: string;
  itemDescribe?: string;
  listClass?: string;
}

export interface SystemDictFormProps {
  initialValues?: SystemDictItem;
  onSubmit: (values: SystemDictFormValues) => Promise<void>;
  onCancel: () => void;
  enableOptions: import('@/utils/dictUtils').DictItem[];
  forceReset?: boolean;
}

