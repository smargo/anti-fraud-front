/**
 * EventConfig 页面辅助函数
 */

import { message } from 'antd';
import moment from 'moment';
import { getDictText } from '@/utils/dictUtils';
import type {
  EventConfigVersion,
  EventConfigVersionInfo,
  FieldItem,
  DeriveFieldItem,
  StageItem,
  StatementDependencyItem,
  EventIndicatorItem,
} from './types';

/**
 * 格式化日期时间
 */
export const formatDateTime = (date: string, separator: string = '-') => {
  if (!date) return '-';
  return moment(date).format(`YYYY${separator}MM${separator}DD HH:mm:ss`);
};

/**
 * 格式化日期
 */
export const formatDate = (date: string, separator: string = '-') => {
  if (!date) return '-';
  return moment(date).format(`YYYY${separator}MM${separator}DD`);
};

/**
 * 选择最佳版本
 */
export const selectBestVersion = (versionHistory: EventConfigVersion[]): EventConfigVersion | null => {
  if (!versionHistory || versionHistory.length === 0) {
    return null;
  }

  // 优先选择生效中的版本
  const activeVersion = versionHistory.find((v) => v.status === 'ACTIVE');
  if (activeVersion) {
    return activeVersion;
  }

  // 其次选择草稿版本
  const draftVersion = versionHistory.find((v) => v.status === 'DRAFT');
  if (draftVersion) {
    return draftVersion;
  }

  // 最后选择已审批的版本
  const approvedVersion = versionHistory.find((v) => v.status === 'APPROVED');
  if (approvedVersion) {
    return approvedVersion;
  }

  // 如果都没有，返回第一个版本
  return versionHistory[0];
};

/**
 * 检查是否存在草稿版本
 */
export const hasDraftVersion = (versionHistory: EventConfigVersion[]): boolean => {
  return versionHistory.some((v) => v.status === 'DRAFT');
};

/**
 * 生成版本选择器选项
 */
export const generateVersionOptions = (
  versionHistory: EventConfigVersion[],
  versionStatusOptions: any[],
) => {
  return versionHistory.map((version) => {
    const shortDesc =
      version.versionDesc && version.versionDesc.length > 20
        ? version.versionDesc.substring(0, 20) + '...'
        : version.versionDesc || '无描述';
    const statusText = getDictText(versionStatusOptions, version.status);
    const fullText = `${version.versionCode} - ${version.versionDesc || '无描述'} (${statusText})`;

    return {
      key: version.id,
      value: version.id,
      label: `${version.versionCode} - ${shortDesc} (${statusText})`,
      title: fullText,
      version,
    };
  });
};

/**
 * 处理成功消息
 */
export const handleSuccessMessage = (messageText: string) => {
  message.success(messageText);
};

/**
 * 处理错误消息
 */
export const handleErrorMessage = (error: any, defaultMessage: string = '操作失败') => {
  if (error.response?.data?.message) {
    message.error(error.response.data.message);
  } else {
    message.error(defaultMessage + '：' + (error.message || '未知错误'));
  }
};

/**
 * 验证表单字段
 */
export const validateFormField = (value: any, rules: any[]) => {
  for (const rule of rules) {
    if (rule.required && (!value || value.trim() === '')) {
      return rule.message || '此字段为必填项';
    }
    if (rule.max && value && value.length > rule.max) {
      return rule.message || `长度不能超过 ${rule.max} 个字符`;
    }
  }
  return null;
};

/**
 * 生成表格操作列
 */
export const generateActionColumn = (
  onView: (record: any) => void,
  onEdit: (record: any) => void,
  onDelete: (record: any) => void,
  isReadOnly: boolean = false,
) => {
  return {
    title: '操作',
    key: 'option',
    valueType: 'option' as const,
    width: 200,
    hideInDescriptions: true,
    render: (_: any, record: any) => [
      { text: '查看', onClick: () => onView(record) },
      { text: '编辑', onClick: isReadOnly ? undefined : () => onEdit(record) },
      { text: '删除', onClick: isReadOnly ? undefined : () => onDelete(record) },
    ],
  };
};
