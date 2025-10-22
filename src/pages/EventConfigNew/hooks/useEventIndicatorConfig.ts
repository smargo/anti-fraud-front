/**
 * 事件指标配置Hook
 */

import { useState, useRef, useCallback } from 'react';
import { message } from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import { 
  queryEventIndicatorsWithNames, 
  createEventIndicator, 
  updateEventIndicator, 
  deleteEventIndicator 
} from '../services/eventIndicatorConfigApi';
import type { EventIndicatorItem, EventIndicatorFormValues, EventIndicatorConfigState } from '../types';

export const useEventIndicatorConfig = (eventNo: string, versionId?: string) => {
  // 事件指标配置状态
  const [eventIndicators, setEventIndicators] = useState<EventIndicatorItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEventIndicator, setEditingEventIndicator] = useState<EventIndicatorItem | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingEventIndicator, setViewingEventIndicator] = useState<EventIndicatorItem | null>(null);
  const [forceReset, setForceReset] = useState(false);
  
  // 表格引用
  const actionRef = useRef<ActionType>(null);

  // 加载事件指标列表
  const loadEventIndicators = useCallback(async (params: any = {}) => {
    try {
      setLoading(true);
      const searchParams = {
        eventNo,
        versionId,
        ...params,
      };
      const response = await queryEventIndicatorsWithNames(searchParams);
      if (response.code === 'SUCCESS') {
        setEventIndicators(response.records || []);
        return {
          data: response.records || [],
          total: response.total,
          success: true,
        };
      } else {
        message.error(response.message || '加载事件指标列表失败');
        return { data: [], total: 0, success: false };
      }
    } catch (error) {
      message.error('加载事件指标列表失败');
      return { data: [], total: 0, success: false };
    } finally {
      setLoading(false);
    }
  }, [eventNo, versionId]);

  // 创建事件指标
  const handleCreateEventIndicator = useCallback(async (values: EventIndicatorFormValues) => {
    try {
      const response = await createEventIndicator({ ...values, eventNo, versionId });
      if (response.code === 'SUCCESS') {
        message.success('创建事件指标成功');
        setModalVisible(false);
        setForceReset(prev => !prev);
        actionRef.current?.reload();
      } else {
        message.error(response.message || '创建事件指标失败');
      }
    } catch (error) {
      message.error('创建事件指标失败');
    }
  }, [eventNo, versionId]);

  // 更新事件指标
  const handleUpdateEventIndicator = useCallback(async (values: EventIndicatorFormValues) => {
    if (!editingEventIndicator) return;
    
    try {
      const response = await updateEventIndicator(editingEventIndicator.id, values);
      if (response.code === 'SUCCESS') {
        message.success('更新事件指标成功');
        setModalVisible(false);
        setEditingEventIndicator(null);
        actionRef.current?.reload();
      } else {
        message.error(response.message || '更新事件指标失败');
      }
    } catch (error) {
      message.error('更新事件指标失败');
    }
  }, [editingEventIndicator]);

  // 删除事件指标
  const handleDeleteEventIndicator = useCallback(async (id: string) => {
    try {
      const response = await deleteEventIndicator(id);
      if (response.code === 'SUCCESS') {
        message.success('删除事件指标成功');
        actionRef.current?.reload();
      } else {
        message.error(response.message || '删除事件指标失败');
      }
    } catch (error) {
      message.error('删除事件指标失败');
    }
  }, []);

  // 显示创建事件指标弹窗
  const showCreateModal = useCallback(() => {
    setEditingEventIndicator(null);
    setForceReset(prev => !prev);
    setModalVisible(true);
  }, []);

  // 显示编辑事件指标弹窗
  const showEditModal = useCallback((eventIndicator: EventIndicatorItem) => {
    setEditingEventIndicator(eventIndicator);
    setModalVisible(true);
  }, []);

  // 显示查看事件指标弹窗
  const showViewModal = useCallback((eventIndicator: EventIndicatorItem) => {
    setViewingEventIndicator(eventIndicator);
    setViewModalVisible(true);
  }, []);

  // 关闭弹窗
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setEditingEventIndicator(null);
  }, []);

  const closeViewModal = useCallback(() => {
    setViewModalVisible(false);
    setViewingEventIndicator(null);
  }, []);

  return {
    // 状态
    eventIndicators,
    loading,
    modalVisible,
    editingEventIndicator,
    viewModalVisible,
    viewingEventIndicator,
    forceReset,
    actionRef,
    
    // 方法
    loadEventIndicators,
    handleCreateEventIndicator,
    handleUpdateEventIndicator,
    handleDeleteEventIndicator,
    showCreateModal,
    showEditModal,
    showViewModal,
    closeModal,
    closeViewModal,
  };
};
