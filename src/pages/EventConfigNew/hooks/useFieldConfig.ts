/**
 * 字段配置Hook
 */

import { useState, useRef, useCallback } from 'react';
import { message } from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import { 
  queryEventFields, 
  createEventField, 
  updateEventField, 
  deleteEventField 
} from '../services/fieldConfigApi';
import type { FieldItem, FieldFormValues, FieldConfigState } from '../types';

export const useFieldConfig = (eventNo: string, versionId?: string) => {
  // 字段配置状态
  const [fields, setFields] = useState<FieldItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<FieldItem | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingField, setViewingField] = useState<FieldItem | null>(null);
  const [forceReset, setForceReset] = useState(false);
  
  // 表格引用
  const actionRef = useRef<ActionType>(null);

  // 加载字段列表
  const loadFields = useCallback(async (params: any = {}) => {
    try {
      setLoading(true);
      const searchParams = {
        eventNo,
        versionId,
        ...params,
      };
      const response = await queryEventFields(searchParams);
      if (response.code === 'SUCCESS') {
        setFields(response.records || []);
        return {
          data: response.records || [],
          total: response.total,
          success: true,
        };
      } else {
        message.error(response.message || '加载字段列表失败');
        return { data: [], total: 0, success: false };
      }
    } catch (error) {
      message.error('加载字段列表失败');
      return { data: [], total: 0, success: false };
    } finally {
      setLoading(false);
    }
  }, [eventNo, versionId]);

  // 创建字段
  const handleCreateField = useCallback(async (values: FieldFormValues) => {
    try {
      const response = await createEventField({ ...values, eventNo, versionId });
      if (response.code === 'SUCCESS') {
        message.success('创建字段成功');
        setModalVisible(false);
        setForceReset(prev => !prev);
        actionRef.current?.reload();
      } else {
        message.error(response.message || '创建字段失败');
      }
    } catch (error) {
      message.error('创建字段失败');
    }
  }, [eventNo, versionId]);

  // 更新字段
  const handleUpdateField = useCallback(async (values: FieldFormValues) => {
    if (!editingField) return;
    
    try {
      const response = await updateEventField(editingField.id, values);
      if (response.code === 'SUCCESS') {
        message.success('更新字段成功');
        setModalVisible(false);
        setEditingField(null);
        actionRef.current?.reload();
      } else {
        message.error(response.message || '更新字段失败');
      }
    } catch (error) {
      message.error('更新字段失败');
    }
  }, [editingField]);

  // 删除字段
  const handleDeleteField = useCallback(async (id: string) => {
    try {
      const response = await deleteEventField(id);
      if (response.code === 'SUCCESS') {
        message.success('删除字段成功');
        actionRef.current?.reload();
      } else {
        message.error(response.message || '删除字段失败');
      }
    } catch (error) {
      message.error('删除字段失败');
    }
  }, []);

  // 显示创建字段弹窗
  const showCreateModal = useCallback(() => {
    setEditingField(null);
    setForceReset(prev => !prev);
    setModalVisible(true);
  }, []);

  // 显示编辑字段弹窗
  const showEditModal = useCallback((field: FieldItem) => {
    setEditingField(field);
    setModalVisible(true);
  }, []);

  // 显示查看字段弹窗
  const showViewModal = useCallback((field: FieldItem) => {
    setViewingField(field);
    setViewModalVisible(true);
  }, []);

  // 关闭弹窗
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setEditingField(null);
  }, []);

  const closeViewModal = useCallback(() => {
    setViewModalVisible(false);
    setViewingField(null);
  }, []);

  return {
    // 状态
    fields,
    loading,
    modalVisible,
    editingField,
    viewModalVisible,
    viewingField,
    forceReset,
    actionRef,
    
    // 方法
    loadFields,
    handleCreateField,
    handleUpdateField,
    handleDeleteField,
    showCreateModal,
    showEditModal,
    showViewModal,
    closeModal,
    closeViewModal,
  };
};
