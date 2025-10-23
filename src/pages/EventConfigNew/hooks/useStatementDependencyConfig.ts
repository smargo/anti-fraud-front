/**
 * 语句依赖配置Hook
 */

import type { ActionType } from '@ant-design/pro-components';
import { message } from 'antd';
import { useCallback, useRef, useState } from 'react';
import {
  createStatementDependency,
  deleteStatementDependency,
  queryStatementDependenciesWithNames,
  updateStatementDependency,
} from '../services/statementDependencyConfigApi';
import type { StatementDependencyFormValues, StatementDependencyItem } from '../types';

export const useStatementDependencyConfig = (
  eventNo: string,
  versionCode?: string,
  externalActionRef?: React.RefObject<any>,
) => {
  // 语句依赖配置状态
  const [statementDependencies, setStatementDependencies] = useState<StatementDependencyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStatementDependency, setEditingStatementDependency] =
    useState<StatementDependencyItem | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingStatementDependency, setViewingStatementDependency] =
    useState<StatementDependencyItem | null>(null);
  const [forceReset, setForceReset] = useState(false);

  // 表格引用 - 使用外部传递的actionRef或内部创建的actionRef
  const internalActionRef = useRef<ActionType>(null);
  const actionRef = externalActionRef || internalActionRef;

  // 加载语句依赖列表
  const loadStatementDependencies = useCallback(
    async (params: any = {}) => {
      try {
        setLoading(true);
        const searchParams = {
          eventNo,
          versionCode,
          ...params,
        };
        const response = await queryStatementDependenciesWithNames(searchParams);
        return response;
      } catch (error) {
        message.error('加载语句依赖列表失败');
        return { data: [], total: 0, success: false };
      } finally {
        setLoading(false);
      }
    },
    [eventNo, versionCode],
  );

  // 创建语句依赖
  const handleCreateStatementDependency = useCallback(
    async (values: StatementDependencyFormValues) => {
      try {
        const response = await createStatementDependency({ ...values, eventNo, versionCode });
        if (response.code === 'SUCCESS') {
          message.success('创建语句依赖成功');
          setModalVisible(false);
          setForceReset((prev) => !prev);
          actionRef.current?.reload();
        } else {
          message.error(response.message || '创建语句依赖失败');
        }
      } catch (error) {
        message.error('创建语句依赖失败');
      }
    },
    [eventNo, versionCode],
  );

  // 更新语句依赖
  const handleUpdateStatementDependency = useCallback(
    async (values: StatementDependencyFormValues) => {
      if (!editingStatementDependency) return;

      try {
        const response = await updateStatementDependency(editingStatementDependency.id, values);
        if (response.code === 'SUCCESS') {
          message.success('更新语句依赖成功');
          setModalVisible(false);
          setEditingStatementDependency(null);
          actionRef.current?.reload();
        } else {
          message.error(response.message || '更新语句依赖失败');
        }
      } catch (error) {
        message.error('更新语句依赖失败');
      }
    },
    [editingStatementDependency],
  );

  // 删除语句依赖
  const handleDeleteStatementDependency = useCallback(async (id: string) => {
    try {
      const response = await deleteStatementDependency(id);
      if (response.code === 'SUCCESS') {
        message.success('删除语句依赖成功');
        actionRef.current?.reload();
      } else {
        message.error(response.message || '删除语句依赖失败');
      }
    } catch (error) {
      message.error('删除语句依赖失败');
    }
  }, []);

  // 显示创建语句依赖弹窗
  const showCreateModal = useCallback(() => {
    setEditingStatementDependency(null);
    setForceReset((prev) => !prev);
    setModalVisible(true);
  }, []);

  // 显示编辑语句依赖弹窗
  const showEditModal = useCallback((statementDependency: StatementDependencyItem) => {
    setEditingStatementDependency(statementDependency);
    setModalVisible(true);
  }, []);

  // 显示查看语句依赖弹窗
  const showViewModal = useCallback((statementDependency: StatementDependencyItem) => {
    setViewingStatementDependency(statementDependency);
    setViewModalVisible(true);
  }, []);

  // 关闭弹窗
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setEditingStatementDependency(null);
  }, []);

  const closeViewModal = useCallback(() => {
    setViewModalVisible(false);
    setViewingStatementDependency(null);
  }, []);

  return {
    // 状态
    statementDependencies,
    loading,
    modalVisible,
    editingStatementDependency,
    viewModalVisible,
    viewingStatementDependency,
    forceReset,
    actionRef,

    // 方法
    loadStatementDependencies,
    handleCreateStatementDependency,
    handleUpdateStatementDependency,
    handleDeleteStatementDependency,
    showCreateModal,
    showEditModal,
    showViewModal,
    closeModal,
    closeViewModal,
  };
};
