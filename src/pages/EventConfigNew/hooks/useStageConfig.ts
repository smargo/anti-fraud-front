/**
 * 阶段配置Hook
 */

import { useState, useRef, useCallback } from 'react';
import { message } from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import { 
  queryStages, 
  createStage, 
  updateStage, 
  deleteStage 
} from '../services/stageConfigApi';
import type { StageItem, StageFormValues, StageConfigState } from '../types';

export const useStageConfig = (eventNo: string, versionId?: string) => {
  // 阶段配置状态
  const [stages, setStages] = useState<StageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStage, setEditingStage] = useState<StageItem | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingStage, setViewingStage] = useState<StageItem | null>(null);
  const [forceReset, setForceReset] = useState(false);
  
  // 表格引用
  const actionRef = useRef<ActionType>(null);

  // 加载阶段列表
  const loadStages = useCallback(async (params: any = {}) => {
    try {
      setLoading(true);
      const searchParams = {
        eventNo,
        versionId,
        ...params,
      };
      const response = await queryStages(searchParams);
      if (response.code === 'SUCCESS') {
        setStages(response.records || []);
        return {
          data: response.records || [],
          total: response.total,
          success: true,
        };
      } else {
        message.error(response.message || '加载阶段列表失败');
        return { data: [], total: 0, success: false };
      }
    } catch (error) {
      message.error('加载阶段列表失败');
      return { data: [], total: 0, success: false };
    } finally {
      setLoading(false);
    }
  }, [eventNo, versionId]);

  // 创建阶段
  const handleCreateStage = useCallback(async (values: StageFormValues) => {
    try {
      const response = await createStage({ ...values, eventNo, versionId });
      if (response.code === 'SUCCESS') {
        message.success('创建阶段成功');
        setModalVisible(false);
        setForceReset(prev => !prev);
        actionRef.current?.reload();
      } else {
        message.error(response.message || '创建阶段失败');
      }
    } catch (error) {
      message.error('创建阶段失败');
    }
  }, [eventNo, versionId]);

  // 更新阶段
  const handleUpdateStage = useCallback(async (values: StageFormValues) => {
    if (!editingStage) return;
    
    try {
      const response = await updateStage(editingStage.id, values);
      if (response.code === 'SUCCESS') {
        message.success('更新阶段成功');
        setModalVisible(false);
        setEditingStage(null);
        actionRef.current?.reload();
      } else {
        message.error(response.message || '更新阶段失败');
      }
    } catch (error) {
      message.error('更新阶段失败');
    }
  }, [editingStage]);

  // 删除阶段
  const handleDeleteStage = useCallback(async (id: string) => {
    try {
      const response = await deleteStage(id);
      if (response.code === 'SUCCESS') {
        message.success('删除阶段成功');
        actionRef.current?.reload();
      } else {
        message.error(response.message || '删除阶段失败');
      }
    } catch (error) {
      message.error('删除阶段失败');
    }
  }, []);

  // 显示创建阶段弹窗
  const showCreateModal = useCallback(() => {
    setEditingStage(null);
    setForceReset(prev => !prev);
    setModalVisible(true);
  }, []);

  // 显示编辑阶段弹窗
  const showEditModal = useCallback((stage: StageItem) => {
    setEditingStage(stage);
    setModalVisible(true);
  }, []);

  // 显示查看阶段弹窗
  const showViewModal = useCallback((stage: StageItem) => {
    setViewingStage(stage);
    setViewModalVisible(true);
  }, []);

  // 关闭弹窗
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setEditingStage(null);
  }, []);

  const closeViewModal = useCallback(() => {
    setViewModalVisible(false);
    setViewingStage(null);
  }, []);

  return {
    // 状态
    stages,
    loading,
    modalVisible,
    editingStage,
    viewModalVisible,
    viewingStage,
    forceReset,
    actionRef,
    
    // 方法
    loadStages,
    handleCreateStage,
    handleUpdateStage,
    handleDeleteStage,
    showCreateModal,
    showEditModal,
    showViewModal,
    closeModal,
    closeViewModal,
  };
};
