/**
 * 衍生字段配置Hook
 */

import type { ActionType } from '@ant-design/pro-components';
import { message } from 'antd';
import { useCallback, useRef, useState } from 'react';
import {
  createDeriveField,
  deleteDeriveField,
  queryDeriveFields,
  updateDeriveField,
} from '../services/deriveFieldConfigApi';
import type { DeriveFieldFormValues, DeriveFieldItem } from '../types';

export const useDeriveFieldConfig = (eventNo: string, versionId?: string) => {
  // 衍生字段配置状态
  const [deriveFields, setDeriveFields] = useState<DeriveFieldItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDeriveField, setEditingDeriveField] = useState<DeriveFieldItem | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingDeriveField, setViewingDeriveField] = useState<DeriveFieldItem | null>(null);
  const [forceReset, setForceReset] = useState(false);

  // 表格引用
  const actionRef = useRef<ActionType>(null);

  // 加载衍生字段列表
  const loadDeriveFields = useCallback(
    async (params: any = {}) => {
      try {
        setLoading(true);
        const searchParams = {
          eventNo,
          versionId,
          ...params,
        };
        const response = await queryDeriveFields(searchParams);
        if (response.success) {
          setDeriveFields(response.data || []);
          return response;
        } else {
          message.error('加载衍生字段列表失败');
          return { data: [], total: 0, success: false };
        }
      } catch (error) {
        message.error('加载衍生字段列表失败');
        return { data: [], total: 0, success: false };
      } finally {
        setLoading(false);
      }
    },
    [eventNo, versionId],
  );

  // 创建衍生字段
  const handleCreateDeriveField = useCallback(
    async (values: DeriveFieldFormValues) => {
      try {
        const response = await createDeriveField({ ...values, eventNo, versionId });
        if (response.code === '0') {
          message.success('创建衍生字段成功');
          setModalVisible(false);
          setForceReset((prev) => !prev);
          actionRef.current?.reload();
        } else {
          message.error(response.message || '创建衍生字段失败');
        }
      } catch (error) {
        message.error('创建衍生字段失败');
      }
    },
    [eventNo, versionId],
  );

  // 更新衍生字段
  const handleUpdateDeriveField = useCallback(
    async (values: DeriveFieldFormValues) => {
      if (!editingDeriveField) return;

      try {
        const response = await updateDeriveField(editingDeriveField.id, values);
        if (response.code === '0') {
          message.success('更新衍生字段成功');
          setModalVisible(false);
          setEditingDeriveField(null);
          actionRef.current?.reload();
        } else {
          message.error(response.message || '更新衍生字段失败');
        }
      } catch (error) {
        message.error('更新衍生字段失败');
      }
    },
    [editingDeriveField],
  );

  // 删除衍生字段
  const handleDeleteDeriveField = useCallback(async (id: string) => {
    try {
      const response = await deleteDeriveField(id);
      if (response.code === '0') {
        message.success('删除衍生字段成功');
        actionRef.current?.reload();
      } else {
        message.error(response.message || '删除衍生字段失败');
      }
    } catch (error) {
      message.error('删除衍生字段失败');
    }
  }, []);

  // 显示创建衍生字段弹窗
  const showCreateModal = useCallback(() => {
    setEditingDeriveField(null);
    setForceReset((prev) => !prev);
    setModalVisible(true);
  }, []);

  // 显示编辑衍生字段弹窗
  const showEditModal = useCallback((deriveField: DeriveFieldItem) => {
    setEditingDeriveField(deriveField);
    setModalVisible(true);
  }, []);

  // 显示查看衍生字段弹窗
  const showViewModal = useCallback((deriveField: DeriveFieldItem) => {
    setViewingDeriveField(deriveField);
    setViewModalVisible(true);
  }, []);

  // 关闭弹窗
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setEditingDeriveField(null);
  }, []);

  const closeViewModal = useCallback(() => {
    setViewModalVisible(false);
    setViewingDeriveField(null);
  }, []);

  return {
    // 状态
    deriveFields,
    loading,
    modalVisible,
    editingDeriveField,
    viewModalVisible,
    viewingDeriveField,
    forceReset,
    actionRef,

    // 方法
    loadDeriveFields,
    handleCreateDeriveField,
    handleUpdateDeriveField,
    handleDeleteDeriveField,
    showCreateModal,
    showEditModal,
    showViewModal,
    closeModal,
    closeViewModal,
  };
};
