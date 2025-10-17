import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Card, Tabs, Button, Space, Form, message, Input, Select, Popconfirm, Modal, Row, Col, Switch, Tooltip, Tag, Typography, Descriptions } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined, SaveOutlined, ArrowLeftOutlined, HistoryOutlined, SendOutlined, FileTextOutlined } from '@ant-design/icons';
import moment from 'moment';
import { queryEvents, createEvent, updateEvent, deleteEvent, getEventByEventNo } from '@/services/event';
import { queryEventFields, createEventField, updateEventField, deleteEventField } from '@/services/field';
import { queryDeriveFields, createDeriveField, updateDeriveField, deleteDeriveField } from '@/services/deriveField';
import { queryStages, createStage, updateStage, deleteStage } from '@/services/stage';
import { queryEventIndicators, queryEventIndicatorsWithNames, createEventIndicator, updateEventIndicator, deleteEventIndicator } from '@/services/eventIndicator';
import { indicatorApi, IndicatorDO } from '@/services/indicator';
import { statementApi, StatementDO } from '@/services/statement';
import { dataSourceApi, DataSourceDO } from '@/services/datasource';
import { queryStatementDependencies, queryStatementDependenciesWithNames, createStatementDependency, updateStatementDependency, deleteStatementDependency, StatementDependencyWithNamesItem } from '@/services/statementDependency';
import { useLocation, useNavigate } from 'umi';
import { EventConfigVersion, getVersionInfo, EventConfigVersionInfo, createDraft, rollbackToVersion, saveDraft } from '@/services/eventConfigVersion';
import { useDictData } from '@/hooks/useDictData';
import { convertDictToValueEnum, getDictText } from '@/utils/dictUtils';

const { TextArea } = Input;

// 事件类型定义
interface EventItem {
  id: string;
  eventNo: string;
  eventName: string;
  eventDesc?: string;
  createdDate: string;
}

export interface EventLoadProp {
  eventNo: string,
  specifyVersion: EventConfigVersion | null
}

// 字段类型定义
interface FieldItem {
  id: string;
  eventNo: string;
  fieldName: string;
  fieldType: string;
  fieldDesc: string;
  validateRegex: string;
  validateScript: string;
  required: boolean;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

// 衍生字段类型定义
interface DeriveFieldItem {
  id: string;
  eventNo: string;
  fieldName: string;
  fieldType: string;
  fieldDesc?: string;
  processType: string;
  processScript: string;
  processBean: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

// 阶段类型定义
interface StageItem {
  id: string;
  eventNo: string;
  stageName: string;
  stageDesc: string;
  stageOrder: number;
  stageNo: string;
  stageBean: string;
  stageParam: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

// 使用扩展的语句依赖接口
type StatementDependencyItem = StatementDependencyWithNamesItem;

// 事件指标类型定义
interface EventIndicatorItem {
  id: string;
  eventNo: string;
  eventName?: string;
  indicatorNo: string;
  indicatorName: string;
  createdDate: string;
}

// 定义需要加载的字典代码列表 - 移到组件外部避免重复创建
const DICT_CODE_LIST = [
  'event_field_type_option', 
  'event_derive_field_process_type_option',
  'event_type_option',
  'event_stage_option',
  'stage_bean_option',
  'version_status_option',
  'event_group_option'
];

// 事件配置页面主组件
const EventConfig: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 使用字典数据管理Hook
  const { getDictOptions, loading } = useDictData(DICT_CODE_LIST);
  const fieldTypeOptions = getDictOptions('event_field_type_option');
  const deriveFieldProcessTypeOptions = getDictOptions('event_derive_field_process_type_option');
  const eventTypeOptions = getDictOptions('event_type_option');
  const eventStageOptions = getDictOptions('event_stage_option');
  const stageBeanOptions = getDictOptions('stage_bean_option');
  const versionStatusOptions = getDictOptions('version_status_option');
  const eventGroupOptions = getDictOptions('event_group_option');

  const [eventNo, setEventNo] = useState<string>('');
  const [eventDetail, setEventDetail] = useState<EventItem | null>(null);
  const [versionInfo, setVersionInfo] = useState<EventConfigVersionInfo>({
    versionHistory: [],
    hasUnsavedChanges: false
  });
  const [versionHistoryVisible, setVersionHistoryVisible] = useState(false);
  const [createVersionModalVisible, setCreateVersionModalVisible] = useState(false);
  const [changeLogModalVisible, setChangeLogModalVisible] = useState(false);
  const [changeLogs, setChangeLogs] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [copyVersionModalVisible, setCopyVersionModalVisible] = useState(false);
  const [copyVersionForm] = Form.useForm();
  const [copyingVersion, setCopyingVersion] = useState<EventConfigVersion | null>(null);
  
  // 指标详情弹窗状态
  const [indicatorDetailVisible, setIndicatorDetailVisible] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorDO | null>(null);
  const [selectedStatement, setSelectedStatement] = useState<StatementDO | null>(null);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSourceDO | null>(null);
  
  // 版本历史表格引用
  const versionHistoryActionRef = useRef<ActionType>();
  
  // 刷新版本历史表格的辅助方法
  const refreshVersionHistory = useCallback(() => {
    if (versionHistoryActionRef.current) {
      versionHistoryActionRef.current.reload();
    }
  }, []);

  // 显示指标详情
  const showIndicatorDetail = async (record: any) => {
    try {
      // 根据指标编号获取完整的指标信息
      const indicatorDetail = await indicatorApi.getByIndicatorNo(record.indicatorNo);
      setSelectedIndicator(indicatorDetail);
      
      // 如果有查询编号，获取关联的语句信息
      if (indicatorDetail.queryNo) {
        try {
          const statementDetail = await statementApi.getByStatementNo(indicatorDetail.queryNo);
          setSelectedStatement(statementDetail);
          
          // 如果有数据源编号，获取数据源信息
          if (statementDetail.dataSourceNo) {
            try {
              const dataSourceDetail = await dataSourceApi.getByDataSourceNo(statementDetail.dataSourceNo);
              setSelectedDataSource(dataSourceDetail);
            } catch (error) {
              console.warn('获取数据源信息失败:', error);
              message.error(error?.message || '获取数据源信息失败');
              setSelectedDataSource(null);
            }
          } else {
            setSelectedDataSource(null);
          }
        } catch (error) {
          console.warn('获取关联语句信息失败:', error);
          message.error(error?.message || '获取关联语句信息失败');
          setSelectedStatement(null);
          setSelectedDataSource(null);
        }
      } else {
        setSelectedStatement(null);
        setSelectedDataSource(null);
      }
      
      setIndicatorDetailVisible(true);
    } catch (error) {
      console.error('获取指标详情失败:', error);
      message.error(error?.message || '获取指标详情失败');
    }
  };

  // 版本控制状态
  const [currentVersion, setCurrentVersion] = useState<EventConfigVersion | null>(null);
  const [isDraftMode, setIsDraftMode] = useState<boolean>(false);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
  const [configEventLoadProp, setConfigEventLoadProp] = useState<EventLoadProp | null>(null);

  // 表单实例
  const [eventForm] = Form.useForm();

  // 从URL参数中获取eventNo
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const eventNoParam = params.get('eventNo');
    if (eventNoParam) {
      setEventNo(eventNoParam);
      loadEventDetail({ eventNo: eventNoParam });
      loadVersionInfo(eventNoParam);
    }
  }, [location.search]);

  // 当事件详情或版本信息更新时，更新表单初始值
  useEffect(() => {
    if (eventDetail || currentVersion) {
      eventForm.setFieldsValue({
        eventNo: eventDetail?.eventNo,
        eventName: eventDetail?.eventName,
        ...currentVersion
      });
    }
  }, [eventDetail, currentVersion, eventForm]);


  // 加载事件详情
  const loadEventDetail = async (params: { eventNo: string }) => {
    try {
      const event = await getEventByEventNo(params.eventNo);
      if (event) {
        setEventDetail(event);
      }
    } catch (error) {
      message.error('加载事件详情失败');
    }
  };

  // 选择最佳版本（生效版本 > 草稿版本）
  const selectBestVersion = (versionHistory: EventConfigVersion[]): EventConfigVersion | null => {
    if (!versionHistory || versionHistory.length === 0) {
      return null;
    }
    
    // 优先选择生效中的版本
    const activeVersion = versionHistory.find(v => v.status === 'ACTIVE');
    if (activeVersion) {
      return activeVersion;
    }
    
    // 其次选择草稿版本
    const draftVersion = versionHistory.find(v => v.status === 'DRAFT');
    if (draftVersion) {
      return draftVersion;
    }
    
    // 最后选择已审批的版本
    const approvedVersion = versionHistory.find(v => v.status === 'APPROVED');
    if (approvedVersion) {
      return approvedVersion;
    }
    
    // 如果都没有，返回第一个版本
    return versionHistory[0];
  };

  // 加载版本信息
  const loadVersionInfo = async (eventNo: string) => {
    try {
      const info = await getVersionInfo(eventNo);
      console.log('loadVersionInfo 获取到的 info:', info);
      setVersionInfo(info);
      
      // 自动选择最佳版本
      const bestVersion = selectBestVersion(info.versionHistory);
      console.log('selectBestVersion 返回的 bestVersion:', bestVersion);
      if (bestVersion) {
        console.log('设置 currentVersion 为:', bestVersion);
        setCurrentVersion(bestVersion);
        setIsDraftMode(bestVersion.status === 'DRAFT');
        setIsReadOnly(bestVersion.status === 'ACTIVE' || bestVersion.status === 'APPROVED' || bestVersion.status == 'ARCHIVED');
        console.log('自动选择版本完成:', bestVersion);
      } else {
        console.log('没有找到可用的版本，设置为 null');
        setCurrentVersion(null);
        setIsDraftMode(false);
        setIsReadOnly(false);
      }
      setConfigEventLoadProp({
        eventNo: eventNo,
        specifyVersion: bestVersion
      });
    } catch (error) {
      console.error('loadVersionInfo 错误:', error);
      message.error('加载版本信息失败');
    }
  };

  // 生成动态标题
  const getPageTitle = () => {
    if (eventDetail) {
      return `事件配置-${eventDetail.eventName || '未知事件'}(${eventDetail.eventNo || eventNo})`;
    }
    return `事件配置-${eventNo}`;
  };

  // 版本控制相关状态
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 字段相关状态
  const [fieldModalVisible, setFieldModalVisible] = useState<boolean>(false);
  const [editingField, setEditingField] = useState<FieldItem | null>(null);
  const [fieldForm] = Form.useForm();
  
  // 字段查看功能状态
  const [fieldViewModalVisible, setFieldViewModalVisible] = useState<boolean>(false);
  const [viewingField, setViewingField] = useState<FieldItem | null>(null);

  // 衍生字段相关状态
  const [deriveFieldModalVisible, setDeriveFieldModalVisible] = useState<boolean>(false);
  const [editingDeriveField, setEditingDeriveField] = useState<DeriveFieldItem | null>(null);
  const [deriveFieldForm] = Form.useForm();
  
  // 衍生字段查看功能状态
  const [deriveFieldViewModalVisible, setDeriveFieldViewModalVisible] = useState<boolean>(false);
  const [viewingDeriveField, setViewingDeriveField] = useState<DeriveFieldItem | null>(null);

  // 阶段相关状态
  const [stageModalVisible, setStageModalVisible] = useState<boolean>(false);
  const [editingStage, setEditingStage] = useState<StageItem | null>(null);
  const [stageForm] = Form.useForm();
  
  // 阶段查看功能状态
  const [stageViewModalVisible, setStageViewModalVisible] = useState<boolean>(false);
  const [viewingStage, setViewingStage] = useState<StageItem | null>(null);

  // 语句依赖相关状态
  const [statementDependencyModalVisible, setStatementDependencyModalVisible] = useState<boolean>(false);
  const [editingStatementDependency, setEditingStatementDependency] = useState<StatementDependencyItem | null>(null);
  const [statementDependencyForm] = Form.useForm();
  const [statementOptions, setStatementOptions] = useState<StatementDO[]>([]);
  const [selectedStatementNo, setSelectedStatementNo] = useState<string | undefined>(undefined);
  const [statementDependencyViewModalVisible, setStatementDependencyViewModalVisible] = useState<boolean>(false);
  const [viewingStatementDependency, setViewingStatementDependency] = useState<StatementDependencyItem | null>(null);

  // 事件指标相关状态
  const [eventIndicatorModalVisible, setEventIndicatorModalVisible] = useState<boolean>(false);
  const [editingEventIndicator, setEditingEventIndicator] = useState<EventIndicatorItem | null>(null);
  const [eventIndicatorForm] = Form.useForm();
  const [indicatorOptions, setIndicatorOptions] = useState<IndicatorDO[]>([]);
  const [indicatorSearchLoading, setIndicatorSearchLoading] = useState<boolean>(false);

  // ProTable actionRefs
  const fieldActionRef = React.useRef<any>();
  const deriveFieldActionRef = React.useRef<any>();
  const stageActionRef = React.useRef<any>();
  const statementDependencyActionRef = React.useRef<any>();
  const eventIndicatorActionRef = React.useRef<any>();

  // 刷新所有表格数据
  const refreshAllTables = () => {
    fieldActionRef.current?.reload();
    deriveFieldActionRef.current?.reload();
    stageActionRef.current?.reload();
    statementDependencyActionRef.current?.reload();
    eventIndicatorActionRef.current?.reload();
  };

  const handleRollbackVersion = async (versionId: number) => {
    const versionToRollback = versionInfo.versionHistory.find(v => v.id === versionId);
    if (!versionToRollback) return;

    Modal.confirm({
      title: '确认回滚',
      content: `确定要回滚到版本 ${versionToRollback.versionCode} 吗？这将激活该版本并停用当前生效版本。`,
      okText: '确认回滚',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await rollbackToVersion(versionId, eventNo);
          message.success('版本回滚成功');
          // 加载版本信息（会自动刷新表格）
          await loadVersionInfo(eventNo);
        } catch (error) {
          message.error(error?.message || '回滚失败');
        }
      },
    });
  };

  const handleVersionSelect = async (versionId: number) => {
    try {
      const selectedVersion = versionInfo.versionHistory.find((v: EventConfigVersion) => v.id === versionId);
      if (selectedVersion) {
        setCurrentVersion(selectedVersion);
        setIsDraftMode(selectedVersion.status === 'DRAFT');
        setIsReadOnly(selectedVersion.status === 'ACTIVE' || selectedVersion.status === 'APPROVED' || selectedVersion.status === 'ARCHIVED');
        setConfigEventLoadProp({
          eventNo: eventNo,
          specifyVersion: selectedVersion
        });
        refreshAllTables();
        message.success(`已切换到版本: ${selectedVersion.versionCode}`);
        // 选择版本后关闭版本历史窗口
        setVersionHistoryVisible(false);
      }
    } catch (error) {
      message.error(error?.message || '切换版本失败');
    }
  };

  // 激活版本
  const handleActivateVersion = async (versionId: number) => {
    const versionToActivate = versionInfo.versionHistory.find(v => v.id === versionId);
    if (!versionToActivate) return;

    Modal.confirm({
      title: '确认激活',
      content: `确定要激活版本 ${versionToActivate.versionCode} 吗？这将激活该版本并且把当前生效版本置为归档。`,
      okText: '确认激活',
      cancelText: '取消',
      okType: 'primary',
      onOk: async () => {
        try {
          const { versionApi } = await import('@/services/eventConfigVersion');
          await versionApi.activateVersion(versionId.toString());
          message.success('版本激活成功');
          // 加载版本信息（会自动刷新表格）
          await loadVersionInfo(eventNo);
        } catch (error) {
          message.error(error?.message || '激活版本失败');
        }
      },
    });
  };

  // 复制版本
  const handleCopyVersion = async (versionId: number) => {
    // 找到要复制的版本
    const versionToCopy = versionInfo.versionHistory.find(v => v.id === versionId);
    if (!versionToCopy) return;
    
    setCopyingVersion(versionToCopy);
    // 自动填入版本描述
    copyVersionForm.setFieldsValue({
      versionCode: ``,
      versionDesc: `复制自版本${versionToCopy.versionCode}`
    });
    setCopyVersionModalVisible(true);
  };

  // 处理复制版本表单提交
  const handleCopyVersionSubmit = async (values: any) => {
    if (!copyingVersion) return;
    
    try {
      const { versionApi } = await import('@/services/eventConfigVersion');
      const newVersion = await versionApi.copyVersion(copyingVersion.id.toString(), values.versionCode);
      message.success('版本复制成功');
      setCopyVersionModalVisible(false);
      copyVersionForm.resetFields();
      setCopyingVersion(null);
      // 加载版本信息（会自动刷新表格）
      await loadVersionInfo(eventNo);
    } catch (error) {
      message.error(error?.message || '版本复制失败');
    }
  };

  // 检查是否存在草稿版本
  const hasDraftVersion = () => {
    return versionInfo.versionHistory.some(v => v.status === 'DRAFT');
  };

  // 删除草稿版本
  const handleDeleteDraftVersion = async (versionId: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个草稿版本吗？删除后无法恢复。',
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          const { discardDraft } = await import('@/services/eventConfigVersion');
          await discardDraft(versionId);
          message.success('草稿版本已删除');
          // 加载版本信息（会自动刷新表格）
          await loadVersionInfo(eventNo);
        } catch (error) {
          message.error(error?.message || '删除草稿版本失败');
        }
      },
    });
  };

  // 查看变更记录
  const handleShowChangeLogs = async () => {
    if (!currentVersion) return;
    
    try {
      const { versionApi } = await import('@/services/eventConfigVersion');
      const logs = await versionApi.getChangeLogs(currentVersion.id.toString());
      setChangeLogs(logs);
      setChangeLogModalVisible(true);
    } catch (error) {
      message.error('获取变更记录失败');
    }
  };

  // 创建版本
  const handleCreateVersion = async (values: any) => {
    try {
      const { versionApi } = await import('@/services/eventConfigVersion');
      const version = await versionApi.createVersion({
        eventNo: eventNo,
        versionCode: values.versionCode,
        versionDesc: values.versionDesc,
      });
      
      message.success('版本创建成功');
      setCreateVersionModalVisible(false);
      form.resetFields();
      
      // 设置新创建的版本为当前版本
      if (version) {
        setCurrentVersion(version);
        setIsDraftMode(version.status === 'DRAFT');
      }
      
      // 加载版本信息（会自动刷新表格）
      await loadVersionInfo(eventNo);
    } catch (error) {
      message.error(error?.message || '创建版本失败');
    }
  };

  // 判断是否应该显示编辑界面
  const shouldShowEditInterface = () => {
    // 检查 currentVersion 是否有效
    if (!configEventLoadProp || !configEventLoadProp.specifyVersion || !configEventLoadProp.specifyVersion.id || !configEventLoadProp.specifyVersion.versionCode) {
      return false; // 没有有效版本
    }

    return true; // 可以编辑
  };

  // 版本信息显示组件
  const VersionInfoDisplay = () => {
    if (!currentVersion || !currentVersion.id || !currentVersion.versionCode) return null;

    /*
    return (
      <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
        <Space>
          <span>当前版本: <strong>{currentVersion.versionCode}</strong></span>
          <span>状态: <strong>{currentVersion.status}</strong></span>
          <span>描述: {currentVersion.versionDesc || '无'}</span>
          {isReadOnly && <span style={{ color: '#ff4d4f' }}>(只读模式)</span>}
        </Space>
      </div>
    );
    */
     return null;
  };

  // 无版本提示组件
  const NoVersionDisplay = () => {
    return (
      <div style={{ 
        marginBottom: 16, 
        padding: 24, 
        background: '#fafafa', 
        borderRadius: 4, 
        textAlign: 'center',
        border: '1px dashed #d9d9d9'
      }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 16, color: '#666' }}>该事件暂无配置版本</span>
        </div>
        <div style={{ color: '#999' }}>
          请先创建版本，然后开始配置事件信息
        </div>
      </div>
    );
  };

  // 版本未选中提示组件
  const NoVersionSelectedDisplay = () => {
    if (currentVersion) return null;
    return (
      <div style={{ 
        marginBottom: 16, 
        padding: 24, 
        background: '#fafafa', 
        borderRadius: 4, 
        textAlign: 'center',
        border: '1px dashed #d9d9d9'
      }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 16, color: '#666' }}>请先选择一个版本进行编辑</span>
        </div>
        <div style={{ color: '#999' }}>
          在版本控制面板中选择要编辑的版本
        </div>
      </div>
    );
  };


  // 基础信息表单提交
  const handleBasicInfoSubmit = async (values: any) => {
    try {
      if (currentVersion) {
        // 更新版本表中的事件信息
        const { updateVersion } = await import('@/services/eventConfigVersion');
        await updateVersion(currentVersion.id, {
          eventType: values.eventType,
          eventGroup: values.eventGroup,
        });
        message.success('基础信息更新成功');
      } else {
        message.error('当前没有可编辑的版本');
      }
    } catch (error) {
      message.error(error?.message || '操作失败');
    }
  };

  // 字段相关处理
  const handleFieldAdd = () => {
    setEditingField(null);
    fieldForm.resetFields();
    // 设置默认的事件编号
    fieldForm.setFieldsValue({ eventNo: eventNo });
    setFieldModalVisible(true);
  };

  const handleFieldEdit = (record: FieldItem) => {
    setEditingField(record);
    fieldForm.setFieldsValue(record);
    setFieldModalVisible(true);
  };

  const handleFieldDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个字段吗？',
      onOk: async () => {
        try {
          const response = await deleteEventField(id);
          if (response.code === 'SUCCESS') {
            message.success('删除成功');
            refreshAllTables();
          } else {
            message.error(response.message || '删除失败');
          }
        } catch (error) {
          message.error(error?.message || '操作失败');
        }
      },
    });
  };

  const handleFieldSubmit = async (values: any) => {
    try {
      const fieldValues = { ...values, eventNo, versionCode: currentVersion?.versionCode };
      if (editingField) {
        const response = await updateEventField({ ...fieldValues, id: editingField.id });
        if (response.code === 'SUCCESS') {
          message.success('更新成功');
        } else {
          message.error(response.message || '更新失败');
          return;
        }
      } else {
        const response = await createEventField(fieldValues);
        if (response.code === 'SUCCESS') {
          message.success('创建成功');
        } else {
          message.error(response.message || '创建失败');
          return;
        }
      }
      setFieldModalVisible(false);
      refreshAllTables();
    } catch (error) {
      message.error(error?.message || '操作失败');
    }
  };

  // 字段查看处理
  const handleFieldView = (record: FieldItem) => {
    setViewingField(record);
    setFieldViewModalVisible(true);
  };

  // 衍生字段相关处理
  const handleDeriveFieldAdd = () => {
    setEditingDeriveField(null);
    deriveFieldForm.resetFields();
    // 设置默认的事件编号
    deriveFieldForm.setFieldsValue({ eventNo: eventNo });
    setDeriveFieldModalVisible(true);
  };

  const handleDeriveFieldEdit = (record: DeriveFieldItem) => {
    setEditingDeriveField(record);
    deriveFieldForm.setFieldsValue(record);
    setDeriveFieldModalVisible(true);
  };

  const handleDeriveFieldDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个衍生字段吗？',
      onOk: async () => {
        try {
          const response = await deleteDeriveField(id);
          if (response.code === 'SUCCESS') {
            message.success('删除成功');
            refreshAllTables();
          } else {
            message.error(response.message || '删除失败');
          }
        } catch (error) {
          message.error(error?.message || '操作失败');
        }
      },
    });
  };

  const handleDeriveFieldSubmit = async (values: any) => {
    try {
      const deriveFieldValues = { ...values, eventNo, versionCode: currentVersion?.versionCode };
      if (editingDeriveField) {
        const response = await updateDeriveField({ ...deriveFieldValues, id: editingDeriveField.id });
        if (response.code === 'SUCCESS') {
          message.success('更新成功');
        } else {
          message.error(response.message || '更新失败');
          return;
        }
      } else {
        const response = await createDeriveField(deriveFieldValues);
        if (response.code === 'SUCCESS') {
          message.success('创建成功');
        } else {
          message.error(response.message || '创建失败');
          return;
        }
      }
      setDeriveFieldModalVisible(false);
      refreshAllTables();
    } catch (error) {
      message.error(error?.message || '操作失败');
    }
  };

  // 衍生字段查看处理
  const handleDeriveFieldView = (record: DeriveFieldItem) => {
    setViewingDeriveField(record);
    setDeriveFieldViewModalVisible(true);
  };

  // 阶段相关处理
  const handleStageAdd = () => {
    setEditingStage(null);
    stageForm.resetFields();
    // 设置默认的事件编号
    stageForm.setFieldsValue({ eventNo: eventNo });
    setStageModalVisible(true);
  };

  const handleStageEdit = (record: StageItem) => {
    setEditingStage(record);
    stageForm.setFieldsValue(record);
    setStageModalVisible(true);
  };

  const handleStageDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个阶段吗？',
      onOk: async () => {
        try {
          const response = await deleteStage(id);
          if (response.code === 'SUCCESS') {
            message.success('删除成功');
            refreshAllTables();
          } else {
            message.error(response.message || '删除失败');
          }
        } catch (error) {
          message.error(error?.message || '操作失败');
        }
      },
    });
  };

  const handleStageSubmit = async (values: any) => {
    try {
      const stageValues = { ...values, eventNo, versionCode: currentVersion?.versionCode };
      if (editingStage) {
        const response = await updateStage({ ...stageValues, id: editingStage.id });
        if (response.code === 'SUCCESS') {
          message.success('更新成功');
        } else {
          message.error(response.message || '更新失败');
          return;
        }
      } else {
        const response = await createStage(stageValues);
        if (response.code === 'SUCCESS') {
          message.success('创建成功');
        } else {
          message.error(response.message || '创建失败');
          return;
        }
      }
      setStageModalVisible(false);
      refreshAllTables();
    } catch (error) {
      message.error(error?.message || '操作失败');
    }
  };

  // 阶段查看处理
  const handleStageView = (record: StageItem) => {
    setViewingStage(record);
    setStageViewModalVisible(true);
  };

  // 获取语句选项
  const loadStatementOptions = async () => {
    if (!eventNo || !currentVersion?.id) {
      setStatementOptions([]);
      return;
    }
    
    try {
      const statements = await statementApi.getByEventNoAndVersionCode(eventNo, currentVersion.versionCode);
      setStatementOptions(statements || []);
    } catch (error) {
      console.error('获取语句选项失败:', error);
      message.error('获取语句选项失败');
      setStatementOptions([]);
    }
  };

  // 语句依赖相关处理
  const handleStatementDependencyAdd = async () => {
    setEditingStatementDependency(null);
    statementDependencyForm.resetFields();
    // 设置默认的事件编号
    statementDependencyForm.setFieldsValue({ eventNo: eventNo });
    // 重置选中的语句编号状态
    setSelectedStatementNo(undefined);
    // 加载语句选项
    await loadStatementOptions();
    setStatementDependencyModalVisible(true);
  };

  const handleStatementDependencyEdit = async (record: StatementDependencyItem) => {
    setEditingStatementDependency(record);
    statementDependencyForm.setFieldsValue(record);
    // 设置选中的语句编号状态
    setSelectedStatementNo(record.statementNo);
    // 加载语句选项
    await loadStatementOptions();
    setStatementDependencyModalVisible(true);
  };

  const handleStatementDependencyDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个语句依赖吗？',
      onOk: async () => {
        try {
          const response = await deleteStatementDependency(id);
          if (response.code === 'SUCCESS') {
            message.success('删除成功');
            refreshAllTables();
          } else {
            message.error(response.message || '删除失败');
          }
        } catch (error) {
          message.error(error?.message || '操作失败');
        }
      },
    });
  };

  const handleStatementDependencySubmit = async (values: any) => {
    try {
      const statementDependencyValues = { ...values, eventNo, versionCode: currentVersion?.versionCode };
      if (editingStatementDependency) {
        const response = await updateStatementDependency({ ...statementDependencyValues, id: editingStatementDependency.id });
        if (response.code === 'SUCCESS') {
          message.success('更新成功');
        } else {
          message.error(response.message || '更新失败');
          return;
        }
      } else {
        const response = await createStatementDependency(statementDependencyValues);
        if (response.code === 'SUCCESS') {
          message.success('创建成功');
        } else {
          message.error(response.message || '创建失败');
          return;
        }
      }
      setStatementDependencyModalVisible(false);
      refreshAllTables();
    } catch (error) {
      message.error(error?.message || '操作失败');
    }
  };

  const handleStatementDependencyView = (record: StatementDependencyItem) => {
    setViewingStatementDependency(record);
    setStatementDependencyViewModalVisible(true);
  };

  // 指标搜索处理
  const handleIndicatorSearch = async (value: string) => {
    if (!value) {
      setIndicatorOptions([]);
      return;
    }
    
    setIndicatorSearchLoading(true);
    try {
      const response = await indicatorApi.search(value, 1, 20);
      setIndicatorOptions(response.records || []);
    } catch (error) {
      console.error('搜索指标失败:', error);
      message.error(error?.message || '搜索指标失败');
      setIndicatorOptions([]);
    } finally {
      setIndicatorSearchLoading(false);
    }
  };

  // 事件指标相关处理
  const handleEventIndicatorAdd = () => {
    setEditingEventIndicator(null);
    eventIndicatorForm.resetFields();
    // 设置默认的事件编号
    eventIndicatorForm.setFieldsValue({ eventNo: eventNo });
    setIndicatorOptions([]); // 清空指标选项
    setEventIndicatorModalVisible(true);
  };

  const handleEventIndicatorEdit = (record: EventIndicatorItem) => {
    setEditingEventIndicator(record);
    eventIndicatorForm.setFieldsValue(record);
    setEventIndicatorModalVisible(true);
  };

  const handleEventIndicatorDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个事件指标吗？',
      onOk: async () => {
        try {
          const response = await deleteEventIndicator(id);
          if (response.code === 'SUCCESS') {
            message.success('删除成功');
            refreshAllTables();
          } else {
            message.error(response.message || '删除失败');
          }
        } catch (error) {
          message.error(error?.message || '操作失败');
        }
      },
    });
  };

  const handleEventIndicatorSubmit = async (values: any) => {
    try {
      const eventIndicatorValues = { ...values, eventNo, versionCode: currentVersion?.versionCode };
      if (editingEventIndicator) {
        const response = await updateEventIndicator({ ...eventIndicatorValues, id: editingEventIndicator.id });
        if (response.code === 'SUCCESS') {
          message.success('更新成功');
        } else {
          message.error(response.message || '更新失败');
          return;
        }
      } else {
        const response = await createEventIndicator(eventIndicatorValues);
        if (response.code === 'SUCCESS') {
          message.success('创建成功');
        } else {
          message.error(response.message || '创建失败');
          return;
        }
      }
      setEventIndicatorModalVisible(false);
      refreshAllTables();
    } catch (error) {
      message.error(error?.message || '操作失败');
    }
  };

  // 字段列定义
  const fieldColumns = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 120,
      search: false,
    },
    {
      title: '字段名称',
      dataIndex: 'fieldName',
      key: 'fieldName',
      width: 150,
      search: {
        placeholder: '请输入字段名称',
        allowClear: true,
      },
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      key: 'fieldType',
      width: 120,
      render: (fieldType: string) => {
        return getDictText(fieldTypeOptions, fieldType);
      },
      search: {
        valueType: 'select',
        valueEnum: convertDictToValueEnum(fieldTypeOptions),
        placeholder: '请选择字段类型',
        allowClear: true,
      },
    },
    {
      title: '字段描述',
      dataIndex: 'fieldDesc',
      key: 'fieldDesc',
      width: 150,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip placement="topLeft">
          <div style={{ 
            maxWidth: '150px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || '-'}
          </div>
        </Tooltip>
      ),
      search: {
        placeholder: '请输入字段描述',
        allowClear: true,
      },
    },
    {
      title: '校验脚本',
      dataIndex: 'validateScript',
      key: 'validateScript',
      width: 150,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip placement="topLeft">
          <div style={{ 
            maxWidth: '200px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || '-'}
          </div>
        </Tooltip>
      ),
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      search: false,
      width: 160,
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      search: false,
      width: 200,
      render: (_: any, record: FieldItem) => (
        <Space size="middle">
          <a onClick={() => handleFieldView(record)}>
            查看
          </a>
          <a 
            onClick={isReadOnly ? undefined : () => handleFieldEdit(record)}
            style={{ color: isReadOnly ? '#ccc' : undefined }}
          >
            编辑
          </a>
          <Popconfirm
            title="确定要删除这个字段吗？"
            onConfirm={() => handleFieldDelete(record.id)}
            okText="确定"
            cancelText="取消"
            disabled={isReadOnly}
          >
            <a 
              style={{ color: isReadOnly ? '#ccc' : 'red' }}
              onClick={isReadOnly ? undefined : () => {}}
            >
              删除
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 衍生字段列定义
  const deriveFieldColumns = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 120,
      search: false,
    },
    {
      title: '字段名称',
      dataIndex: 'fieldName',
      key: 'fieldName',
      width: 120,
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      key: 'fieldType',
      width: 90,
      render: (fieldType: string) => {
        return getDictText(fieldTypeOptions, fieldType);
      },
      search: {
        valueType: 'select',
        valueEnum: convertDictToValueEnum(fieldTypeOptions),
        placeholder: '请选择字段类型',
        allowClear: true,
      },
    },
    {
      title: '字段描述',
      dataIndex: 'fieldDesc',
      key: 'fieldDesc',
      width: 150,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip>
          <div style={{ 
            maxWidth: '150px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || '-'}
          </div>
        </Tooltip>
      ),
      search: {
        placeholder: '请输入字段描述',
        allowClear: true,
      },
    },
    {
      title: '处理类型',
      dataIndex: 'processType',
      key: 'processType',
      search: false,
      width: 120,
      render: (processType: string) => {
        return getDictText(deriveFieldProcessTypeOptions, processType);
      },
      search: {
        valueType: 'select',
        valueEnum: convertDictToValueEnum(deriveFieldProcessTypeOptions),
        placeholder: '请选择处理类型',
        allowClear: true,
      },
    },
    {
      title: '处理脚本',
      dataIndex: 'processScript',
      key: 'processScript',
      width: 200,
      search: false,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip placement="topLeft">
          <div style={{ 
            maxWidth: '200px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || '-'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '处理Bean',
      dataIndex: 'processBean',
      key: 'processBean',
      search: false,
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      search: false,
      width: 160,
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: DeriveFieldItem) => (
        <Space size="middle">
          <a onClick={() => handleDeriveFieldView(record)}>
            查看
          </a>
          <a 
            onClick={isReadOnly ? undefined : () => handleDeriveFieldEdit(record)}
            style={{ color: isReadOnly ? '#ccc' : undefined }}
          >
            编辑
          </a>
          <Popconfirm
            title="确定要删除这个衍生字段吗？"
            onConfirm={() => handleDeriveFieldDelete(record.id)}
            okText="确定"
            cancelText="取消"
            disabled={isReadOnly}
          >
            <a 
              style={{ color: isReadOnly ? '#ccc' : 'red' }}
              onClick={isReadOnly ? undefined : () => {}}
            >
              删除
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 阶段列定义
  const stageColumns = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 120,
      search: false,
    },
    {
      title: '阶段编号',
      dataIndex: 'stageNo',
      key: 'stageNo',
      width: 80,
      render: (stage: string) => {
        return getDictText(eventStageOptions, stage);
      },
      search: {
        valueType: 'select',
        valueEnum: convertDictToValueEnum(eventStageOptions),
        placeholder: '请选择阶段编号',
        allowClear: true,
      },
    },
    {
      title: '阶段名称',
      dataIndex: 'stageName',
      key: 'stageName',
      width: 150,
      search: false,
    },
    {
      title: '阶段组件',
      dataIndex: 'stageBean',
      key: 'stageBean',
      width: 200,
      ellipsis: true,
      render: (_, record: StageItem) => {
        const bean = record.stageBean;
        const beanStr = String(bean || '');
        const dictText = getDictText(stageBeanOptions, beanStr);
        const displayText = dictText ? `${beanStr}-${dictText}` : beanStr || '-';
        return (
          <Tooltip title={displayText} placement="topLeft">
            <span style={{ 
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {displayText}
            </span>
          </Tooltip>
        );
      },
      search: false,
    },
    {
      title: '阶段参数',
      dataIndex: 'stageParam',
      key: 'stageParam',
      width: 150,
      render: (statementNo: string) => statementNo || '-',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 170,
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 200,
      render: (_: any, record: StageItem) => (
        <Space size="middle">
          <a onClick={() => handleStageView(record)}>
            查看
          </a>
          <a 
            onClick={isReadOnly ? undefined : () => handleStageEdit(record)}
            style={{ color: isReadOnly ? '#ccc' : undefined }}
          >
            编辑
          </a>
          <Popconfirm
            title="确定要删除这个阶段吗？"
            onConfirm={() => handleStageDelete(record.id)}
            okText="确定"
            cancelText="取消"
            disabled={isReadOnly}
          >
            <a 
              style={{ color: isReadOnly ? '#ccc' : 'red' }}
              onClick={isReadOnly ? undefined : () => {}}
            >
              删除
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 语句依赖列定义
  const statementDependencyColumns = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 200,
      search: false
    },
    {
      title: '语句编号',
      dataIndex: 'statementNo',
      key: 'statementNo',
      width: 120,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip placement="topLeft">
          <div style={{ 
            maxWidth: '100px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || '无'}
          </div>
        </Tooltip>
      ),
      search: {
        placeholder: '请输入语句编号',
        allowClear: true,
        labelWidth: 100,
      },
    },
    {
      title: '语句描述',
      dataIndex: 'statementDesc',
      key: 'statementDesc',
      width: 150,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip placement="topLeft">
          <div style={{ 
            maxWidth: '130px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || '无'}
          </div>
        </Tooltip>
      ),
      search: false,
    },
    {
      title: '依赖语句编号',
      dataIndex: 'dependStatementNo',
      key: 'dependStatementNo',
      width: 120,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip placement="topLeft">
          <div style={{ 
            maxWidth: '100px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || '无'}
          </div>
        </Tooltip>
      ),
      search: {
        placeholder: '请输入依赖语句编号',
        allowClear: true,
        labelWidth: 280,
      },
    },
    {
      title: '依赖语句描述',
      dataIndex: 'dependStatementDesc',
      key: 'dependStatementDesc',
      width: 150,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip placement="topLeft">
          <div style={{ 
            maxWidth: '130px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || '无'}
          </div>
        </Tooltip>
      ),
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 150,
      search: false,
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 200,
      render: (_: any, record: StatementDependencyItem) => (
        <Space size="middle">
          <Button 
            type="link" 
            onClick={() => handleStatementDependencyView(record)}
          >
            查看
          </Button>
          <a 
            onClick={isReadOnly ? undefined : () => handleStatementDependencyEdit(record)}
            style={{ color: isReadOnly ? '#ccc' : undefined }}
          >
            编辑
          </a>
          <Popconfirm
            title="确定要删除这个语句依赖吗？"
            onConfirm={() => handleStatementDependencyDelete(record.id)}
            okText="确定"
            cancelText="取消"
            disabled={isReadOnly}
          >
            <a 
              style={{ color: isReadOnly ? '#ccc' : 'red' }}
              onClick={isReadOnly ? undefined : () => {}}
            >
              删除
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 事件指标列定义
  const eventIndicatorColumns = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 120,
      search: false
    },
    {
      title: '事件名称',
      dataIndex: 'eventName',
      key: 'eventName',
      width: 200,
      search: false,
      ellipsis: true,
      render: (text: any) => (
        <Tooltip placement="topLeft">
          <div style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || '无'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '指标编号',
      dataIndex: 'indicatorNo',
      key: 'indicatorNo',
      width: 150,
      render: (indicatorNo: string, record: any) => (
        <Tooltip title="请点击查看" placement="topLeft">
          <a 
            onClick={() => showIndicatorDetail(record)}
            style={{ 
              cursor: 'pointer', 
              color: '#1890ff',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            {indicatorNo}
          </a>
        </Tooltip>
      ),
    },
    {
      title: '指标名称',
      dataIndex: 'indicatorName',
      key: 'indicatorName',
      search: false,
      width: 200,
      ellipsis: true,
      render: (text: any) => (
        <Tooltip placement="topLeft">
          <div style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || '无'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      search: false,
      width: 150,
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 150,
      render: (_: any, record: EventIndicatorItem) => (
        <Space size="middle">
          <a 
            onClick={isReadOnly ? undefined : () => handleEventIndicatorEdit(record)}
            style={{ color: isReadOnly ? '#ccc' : undefined }}
          >
            编辑
          </a>
          <Popconfirm
            title="确定要删除这个事件指标吗？"
            onConfirm={() => handleEventIndicatorDelete(record.id)}
            okText="确定"
            cancelText="取消"
            disabled={isReadOnly}
          >
            <a 
              style={{ color: isReadOnly ? '#ccc' : 'red' }}
              onClick={isReadOnly ? undefined : () => {}}
            >
              删除
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title={getPageTitle()}
      extra={[
        <Button key="back" icon={<ArrowLeftOutlined />} onClick={() => navigate('/event/list')}>
          返回事件列表
        </Button>,
      ]}
    >
      {/* 版本控制组件 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3>版本控制</h3>
            {currentVersion && (
              <div style={{ marginTop: 8 }}>
                <Space>
                  <span>当前版本: <strong>{currentVersion.versionCode}</strong></span>
                  <span>状态: <strong>{getDictText(versionStatusOptions, currentVersion.status)}</strong></span>
                  <span>描述: {currentVersion.versionDesc || '无'}</span>
                  <span>版本id: {currentVersion.id}</span>
                  {isReadOnly && <span style={{ color: '#ff4d4f' }}>(只读)</span>}
                </Space>
              </div>
            )}
          </div>
          <Space>
            <Button 
              type="primary" 
              onClick={() => setCreateVersionModalVisible(true)}
              disabled={isDraftMode || hasDraftVersion()}
              icon={<PlusOutlined />}
            >
              创建新版本
            </Button>
            <Button 
              type="primary" 
              onClick={() => handleActivateVersion(currentVersion?.id || 0)}
              disabled={!isDraftMode || isReadOnly || !currentVersion}
              icon={<SendOutlined />}
            >
              激活版本
            </Button>
            <Button 
              icon={<HistoryOutlined />}
              onClick={() => setVersionHistoryVisible(true)}
            >
              版本历史
            </Button>
            {/* 变更记录按钮 - 暂时注释，当前变更记录没有太多有效信息 */}
            {/* <Button 
              icon={<FileTextOutlined />}
              onClick={handleShowChangeLogs}
            >
              变更记录
            </Button> */}
          </Space>
        </div>
        
        {/* 版本选择器 */}
        {versionInfo.versionHistory.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <span style={{ marginRight: 8 }}>选择版本:</span>
            <Select
              value={currentVersion?.id}
              onChange={handleVersionSelect}
              style={{ width: 400 }}
              placeholder="请选择版本"
              optionLabelProp="label"
            >
              {versionInfo.versionHistory.map(version => {
                const shortDesc = version.versionDesc && version.versionDesc.length > 20 
                  ? version.versionDesc.substring(0, 20) + '...' 
                  : (version.versionDesc || '无描述');
                const statusText = getDictText(versionStatusOptions, version.status);
                const fullText = `${version.versionCode} - ${version.versionDesc || '无描述'} (${statusText})`;
                
                return (
                  <Select.Option 
                    key={version.id} 
                    value={version.id}
                    label={`${version.versionCode} - ${shortDesc} (${statusText})`}
                    title={fullText}
                  >
                    <div style={{ 
                      maxWidth: '350px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      <strong>{version.versionCode}</strong> - {shortDesc} <span style={{ color: '#999' }}>({statusText})</span>
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
          </div>
        )}
      </Card>

      {/* 配置内容 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* 基础信息 Tab */}
          <Tabs.TabPane tab="基础信息" key="basic">
            {/* 根据状态显示不同的界面 */}
            {!configEventLoadProp || !configEventLoadProp.specifyVersion || !configEventLoadProp.specifyVersion.id || !configEventLoadProp.specifyVersion.versionCode ? (
              <NoVersionDisplay />
            ) : !shouldShowEditInterface() ? (
              <>
                <VersionInfoDisplay />
                <NoVersionSelectedDisplay />
              </>
            ) : (
              <>
                <VersionInfoDisplay />
            <Form
              form={eventForm}
              layout="horizontal"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              onFinish={handleBasicInfoSubmit}
                  initialValues={{
                    eventNo: eventDetail?.eventNo,
                    eventName: eventDetail?.eventName,
                    ...currentVersion
                  }}
            >
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item 
                    name="eventNo" 
                    label="事件编号" 
                    rules={[{ required: true }]}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Input placeholder="请输入事件编号" disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    name="eventName" 
                    label="事件名称" 
                    rules={[{ required: true }]}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Input placeholder="请输入事件名称" disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item 
                    name="eventType" 
                    label="事件类型" 
                    rules={[{ required: true }]}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Select placeholder="请选择事件类型" disabled={isReadOnly}>
                      {eventTypeOptions.map((option: any) => (
                        <Select.Option key={option.itemNo} value={option.itemNo}>
                          {option.itemDescribe}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    name="eventGroup" 
                    label="事件分组" 
                    rules={[{ required: true }]}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Select placeholder="请选择事件分组" disabled={isReadOnly}>
                      {eventGroupOptions.map((option: any) => (
                        <Select.Option key={option.itemNo} value={option.itemNo}>
                          {option.itemDescribe}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

              </Row>
                  {!isReadOnly && (
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  保存基础信息
                </Button>
              </Form.Item>
                  )}
            </Form>
              </>
            )}
          </Tabs.TabPane>

          {/* 字段配置 Tab */}
          <Tabs.TabPane tab="字段配置" key="fields">
            {/* 根据状态显示不同的界面 */}
            {!configEventLoadProp || !configEventLoadProp.specifyVersion || !configEventLoadProp.specifyVersion.id || !configEventLoadProp.specifyVersion.versionCode ? (
              <NoVersionDisplay />
            ) : !shouldShowEditInterface() ? (
              <>
                <VersionInfoDisplay />
                <NoVersionSelectedDisplay />
              </>
            ) : (
              <>
                <VersionInfoDisplay />
            <ProTable
              actionRef={fieldActionRef}
              columns={fieldColumns}
              request={async (params) => {
                const response = await queryEventFields({
                  ...params,
                  eventNo: eventNo,
                      versionCode: currentVersion?.versionCode,
                });
                return {
                  data: response.records || response.data || [],
                  total: response.total || 0,
                  success: true,
                };
              }}
              rowKey="id"
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
              toolBarRender={() => [
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={handleFieldAdd} 
                      key="add"
                      disabled={isReadOnly}
                    >
                  新增字段
                </Button>,
              ]}
            />
              </>
            )}
          </Tabs.TabPane>

          {/* 衍生字段 Tab */}
          <Tabs.TabPane tab="衍生字段" key="derive">
            {/* 根据状态显示不同的界面 */}
            {!configEventLoadProp || !configEventLoadProp.specifyVersion || !configEventLoadProp.specifyVersion.id || !configEventLoadProp.specifyVersion.versionCode ? (
              <NoVersionDisplay />
            ) : !shouldShowEditInterface() ? (
              <>
                <VersionInfoDisplay />
                <NoVersionSelectedDisplay />
              </>
            ) : (
              <>
                <VersionInfoDisplay />
            <ProTable
              actionRef={deriveFieldActionRef}
              columns={deriveFieldColumns}
              request={async (params) => {
                const response = await queryDeriveFields({
                  ...params,
                  eventNo: eventNo,
                      versionCode: currentVersion?.versionCode,
                });
                return {
                  data: response.records || response.data || [],
                  total: response.total || 0,
                  success: true,
                };
              }}
              rowKey="id"
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
              scroll={{ x: 1200 }}
              toolBarRender={() => [
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={handleDeriveFieldAdd} 
                      key="add"
                      disabled={isReadOnly}
                    >
                  新增衍生字段
                </Button>,
              ]}
            />
              </>
            )}
          </Tabs.TabPane>

          {/* 阶段配置 Tab */}
          <Tabs.TabPane tab="阶段配置" key="stages">
            {/* 根据状态显示不同的界面 */}
            {!configEventLoadProp || !configEventLoadProp.specifyVersion || !configEventLoadProp.specifyVersion.id || !configEventLoadProp.specifyVersion.versionCode ? (
              <NoVersionDisplay />
            ) : !shouldShowEditInterface() ? (
              <>
                <VersionInfoDisplay />
                <NoVersionSelectedDisplay />
              </>
            ) : (
              <>
                <VersionInfoDisplay />
            <ProTable
              actionRef={stageActionRef}
              columns={stageColumns}
              request={async (params) => {
                const response = await queryStages({
                  ...params,
                  eventNo: eventNo,
                      versionCode: currentVersion?.versionCode,
                });
                return {
                  data: response.records || response.data || [],
                  total: response.total || 0,
                  success: true,
                };
              }}
              rowKey="id"
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
              toolBarRender={() => [
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={handleStageAdd} 
                      key="add"
                      disabled={isReadOnly}
                    >
                  新增阶段
                </Button>,
              ]}
            />
              </>
            )}
          </Tabs.TabPane>

          {/* 事件指标 Tab */}
          <Tabs.TabPane tab="事件指标" key="indicators">
            {/* 根据状态显示不同的界面 */}
            {!configEventLoadProp || !configEventLoadProp.specifyVersion || !configEventLoadProp.specifyVersion.id || !configEventLoadProp.specifyVersion.versionCode ? (
              <NoVersionDisplay />
            ) : !shouldShowEditInterface() ? (
              <>
                <VersionInfoDisplay />
                <NoVersionSelectedDisplay />
              </>
            ) : (
              <>
                <VersionInfoDisplay />
            <ProTable
              actionRef={eventIndicatorActionRef}
              columns={eventIndicatorColumns}
              request={async (params) => {
                const response = await queryEventIndicatorsWithNames({
                  ...params,
                  eventNo: eventNo,
                  versionCode: currentVersion?.versionCode,
                });
                return {
                  data: response.records || response.data || [],
                  total: response.total || 0,
                  success: true,
                };
              }}
              rowKey="id"
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
              toolBarRender={() => [
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={handleEventIndicatorAdd} 
                      key="add"
                      disabled={isReadOnly}
                    >
                  新增事件指标
                </Button>,
              ]}
            />
              </>
            )}
          </Tabs.TabPane>


          {/* 语句依赖 Tab */}
          <Tabs.TabPane tab="语句依赖" key="dependencies">
            {/* 根据状态显示不同的界面 */}
            {!configEventLoadProp || !configEventLoadProp.specifyVersion|| !configEventLoadProp.specifyVersion.id || !configEventLoadProp.specifyVersion.versionCode ? (
              <NoVersionDisplay />
            ) : !shouldShowEditInterface() ? (
              <>
                <VersionInfoDisplay />
                <NoVersionSelectedDisplay />
              </>
            ) : (
              <>
                <VersionInfoDisplay />
            <ProTable
              actionRef={statementDependencyActionRef}
              columns={statementDependencyColumns}
              request={async (params) => {
                const response = await queryStatementDependenciesWithNames({
                  ...params,
                  eventNo: eventNo,
                      versionCode: currentVersion?.versionCode,
                });
                return {
                  data: response.records || response.data || [],
                  total: response.total || 0,
                  success: true,
                };
              }}
              rowKey="id"
              search={{
                labelWidth: 'auto',
                span: 8,
                defaultCollapsed: false,
              }}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
              toolBarRender={() => [
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={handleStatementDependencyAdd} 
                      key="add"
                      disabled={isReadOnly}
                    >
                  新增语句依赖
                </Button>,
              ]}
            />
              </>
            )}
          </Tabs.TabPane>
        </Tabs>
      </Card>

      {/* 字段编辑模态框 */}
      <Modal
        title={editingField ? '编辑字段' : '新增字段'}
        open={fieldModalVisible}
        onCancel={() => setFieldModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={fieldForm}
          layout="vertical"
          onFinish={handleFieldSubmit}
        >
          <Form.Item name="fieldName" label="字段名称" rules={[{ required: true, message: '请输入字段名称' }]}>
            <Input placeholder="请输入字段名称" />
          </Form.Item>
          <Form.Item name="fieldType" label="字段类型" rules={[{ required: true, message: '请选择字段类型' }]}>
            <Select 
              placeholder="请选择字段类型"
              loading={loading}
              disabled={loading}
            >
              {fieldTypeOptions.map((option: any) => (
                <Select.Option key={option.itemNo} value={option.itemNo}>
                  {option.itemDescribe}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="fieldDesc" label="字段描述" rules={[{ required: true, message: '请输入字段描述' }]}>
            <TextArea placeholder="请输入字段描述" rows={3} />
          </Form.Item>
          <Form.Item 
            name="validateScript" 
            label={
              <span>
                校验脚本
                <Tooltip 
                  title={
                    <div style={{ maxWidth: '400px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#fff' }}>Groovy校验脚本模板：</div>
                      <pre 
                        style={{ 
                          background: '#1e1e1e', 
                          color: '#d4d4d4',
                          padding: '12px', 
                          borderRadius: '6px', 
                          fontSize: '12px',
                          margin: 0,
                          whiteSpace: 'pre-wrap',
                          fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                          border: '1px solid #333',
                          lineHeight: '1.4',
                          cursor: 'pointer',
                          userSelect: 'all'
                        }}
                        onClick={() => {
                          const templateCode = `def validate(Map<String, Object> params) {
    def u = params.get("userName");
    return u !=null && !u.isEmpty();
}`;
                          fieldForm.setFieldsValue({ validateScript: templateCode });
                        }}
                        title="点击复制模板代码到输入框"
                      >
{`def validate(Map<String, Object> params) {
    def u = params.get("userName");
    return u !=null && !u.isEmpty();
}`}
                      </pre>
                      <div style={{ marginTop: '8px', fontSize: '12px', color: '#e6e6e6' }}>
                        参数说明：<br/>
                        • params: 当前所有的输入字段<br/>
                        • 返回true表示验证通过，false表示验证失败<br/>
                        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>💡 点击上方代码可复制到输入框</span>
                      </div>
                    </div>
                  }
                  placement="topLeft"
                  overlayStyle={{ maxWidth: '500px' }}
                >
                  <span style={{ marginLeft: '4px', color: '#1890ff', cursor: 'help' }}>?</span>
                </Tooltip>
              </span>
            }
          >
            <TextArea placeholder={`请输入groovy校验脚本（可选），样例：
def validate(Map<String, Object> params) {
    def u = params.get("userName");
    return u !=null && !u.isEmpty();
}`} rows={4} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingField ? '更新' : '创建'}
              </Button>
              <Button onClick={() => setFieldModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 字段查看模态框 */}
      <Modal
        title="字段详情"
        open={fieldViewModalVisible}
        onCancel={() => setFieldViewModalVisible(false)}
        footer={null}
        width={800}
      >
        {viewingField && (
          <Descriptions 
            bordered 
            column={2}
            size="middle"
          >
            <Descriptions.Item label="字段ID" span={2}>
              <Tag color="blue">{viewingField.id}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="事件编号">
              <Tag color="green">{viewingField.eventNo}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="版本代码">
              <Tag color="purple">{currentVersion?.versionCode || '-'}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="字段名称">
              <strong>{viewingField.fieldName}</strong>
            </Descriptions.Item>
            
            <Descriptions.Item label="字段类型">
              <Tag color="orange">
                {getDictText(fieldTypeOptions, viewingField.fieldType)}
              </Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="字段描述" span={2}>
              <div style={{ 
                padding: '8px 12px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '4px',
                minHeight: '40px'
              }}>
                {viewingField.fieldDesc || '无描述'}
              </div>
            </Descriptions.Item>
            
            <Descriptions.Item label="验证脚本" span={2}>
              <div style={{ 
                padding: '8px 12px', 
                backgroundColor: '#fff7e6', 
                borderRadius: '4px',
                fontFamily: 'monospace',
                minHeight: '60px',
                whiteSpace: 'pre-wrap'
              }}>
                {viewingField.validateScript || '无验证脚本'}
              </div>
            </Descriptions.Item>
            
            <Descriptions.Item label="创建时间">
              {moment(viewingField.createdDate).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            
            <Descriptions.Item label="创建人">
              <Tag color="cyan">{viewingField.createdBy || '未知'}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="最后修改时间">
              {viewingField.lastModifiedDate ? 
                moment(viewingField.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss') : 
                '无'
              }
            </Descriptions.Item>
            
            <Descriptions.Item label="最后修改人">
              <Tag color="magenta">{viewingField.lastModifiedBy || '未知'}</Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 衍生字段编辑模态框 */}
      <Modal
        title={editingDeriveField ? '编辑衍生字段' : '新增衍生字段'}
        open={deriveFieldModalVisible}
        onCancel={() => setDeriveFieldModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={deriveFieldForm}
          layout="vertical"
          onFinish={handleDeriveFieldSubmit}
        >
          <Form.Item name="fieldName" label="字段名称" rules={[{ required: true }]}>
            <Input placeholder="请输入字段名称" />
          </Form.Item>
          <Form.Item name="fieldType" label="字段类型" rules={[{ required: true }]}>
            <Select placeholder="请选择字段类型">
              {fieldTypeOptions.map((option: any) => (
                <Select.Option key={option.itemNo} value={option.itemNo}>
                  {option.itemDescribe}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="fieldDesc" label="字段描述">
            <TextArea placeholder="请输入字段描述" rows={3} />
          </Form.Item>
          <Form.Item name="processType" label="处理类型" rules={[{ required: true }]}>
            <Select placeholder="请选择处理类型">
              {deriveFieldProcessTypeOptions.map((option: any) => (
                <Select.Option key={option.itemNo} value={option.itemNo}>
                  {option.itemDescribe}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item 
            name="processScript" 
            label={
              <span>
                处理脚本
                <Tooltip 
                  title={
                    <div style={{ maxWidth: '400px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#fff' }}>Groovy衍生字段计算模板：</div>
                      <pre 
                        style={{ 
                          background: '#1e1e1e', 
                          color: '#d4d4d4',
                          padding: '12px', 
                          borderRadius: '6px', 
                          fontSize: '12px',
                          margin: 0,
                          whiteSpace: 'pre-wrap',
                          fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                          border: '1px solid #333',
                          lineHeight: '1.4',
                          cursor: 'pointer',
                          userSelect: 'all'
                        }}
                        onClick={() => {
                          const templateCode = `def calculate(params) {
    // 获取输入数据
    def amount = params.get('amount') ?: 0
    def rate = params.get('rate') ?: 0.1
    def discount = params.get('discount') ?: 0
    
    // 计算逻辑
    def result = amount * rate
    if (discount > 0) {
        result = result * (1 - discount)
    }
    
    return result
}`;
                          deriveFieldForm.setFieldsValue({ processScript: templateCode });
                        }}
                        title="点击复制模板代码到输入框"
                      >
{`def calculate(params) {
    // 获取输入数据
    def amount = params.get('amount') ?: 0
    def rate = params.get('rate') ?: 0.1
    def discount = params.get('discount') ?: 0
    
    // 计算逻辑
    def result = amount * rate
    if (discount > 0) {
        result = result * (1 - discount)
    }
    
    return result
}`}
                      </pre>
                      <div style={{ marginTop: '8px', fontSize: '12px', color: '#e6e6e6' }}>
                        参数说明：<br/>
                        • params: 包含所有事件字段<br/>
                        • 使用 params.get('字段名') 获取字段值<br/>
                        • 使用 ?: 操作符提供默认值<br/>
                        • 返回计算结果<br/>
                        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>💡 点击上方代码可复制到输入框</span>
                      </div>
                    </div>
                  }
                  placement="topLeft"
                  overlayStyle={{ maxWidth: '500px' }}
                >
                  <span style={{ marginLeft: '4px', color: '#1890ff', cursor: 'help' }}>?</span>
                </Tooltip>
              </span>
            }
          >
            <TextArea placeholder="请输入处理脚本" rows={6} />
          </Form.Item>
          <Form.Item name="processBean" label="处理Bean">
            <Input placeholder="请输入处理Bean类名" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingDeriveField ? '更新' : '创建'}
              </Button>
              <Button onClick={() => setDeriveFieldModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 衍生字段查看模态框 */}
      <Modal
        title="衍生字段详情"
        open={deriveFieldViewModalVisible}
        onCancel={() => setDeriveFieldViewModalVisible(false)}
        footer={null}
        width={800}
      >
        {viewingDeriveField && (
          <Descriptions 
            bordered 
            column={2}
            size="middle"
          >
            <Descriptions.Item label="字段ID" span={2}>
              <Tag color="blue">{viewingDeriveField.id}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="事件编号">
              <Tag color="green">{viewingDeriveField.eventNo}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="版本代码">
              <Tag color="purple">{currentVersion?.versionCode || '-'}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="衍生字段名称">
              <strong>{viewingDeriveField.fieldName}</strong>
            </Descriptions.Item>
            
            <Descriptions.Item label="字段类型">
              <Tag color="orange">{getDictText(fieldTypeOptions, viewingDeriveField.fieldType)}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="字段描述" span={2}>
              <div style={{ 
                padding: '8px 12px', 
                backgroundColor: '#f6f8fa', 
                borderRadius: '4px',
                minHeight: '40px',
                whiteSpace: 'pre-wrap'
              }}>
                {viewingDeriveField.fieldDesc || '无描述'}
              </div>
            </Descriptions.Item>
            
            <Descriptions.Item label="处理类型">
              <Tag color="cyan">{getDictText(deriveFieldProcessTypeOptions, viewingDeriveField.processType)}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="处理类">
              <Tag color="magenta">{viewingDeriveField.processBean || '无'}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="衍生脚本" span={2}>
              <div style={{ 
                padding: '8px 12px', 
                backgroundColor: '#fff7e6', 
                borderRadius: '4px',
                fontFamily: 'monospace',
                minHeight: '60px',
                whiteSpace: 'pre-wrap'
              }}>
                {viewingDeriveField.processScript || '无衍生脚本'}
              </div>
            </Descriptions.Item>
            
            <Descriptions.Item label="创建时间">
              {moment(viewingDeriveField.createdDate).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            
            <Descriptions.Item label="创建人">
              <Tag color="cyan">{viewingDeriveField.createdBy || '未知'}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="最后修改时间">
              {viewingDeriveField.lastModifiedDate ? 
                moment(viewingDeriveField.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss') : 
                '无'
              }
            </Descriptions.Item>
            
            <Descriptions.Item label="最后修改人">
              <Tag color="magenta">{viewingDeriveField.lastModifiedBy || '未知'}</Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 阶段编辑模态框 */}
      <Modal
        title={editingStage ? '编辑阶段' : '新增阶段'}
        open={stageModalVisible}
        onCancel={() => setStageModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={stageForm}
          layout="vertical"
          onFinish={handleStageSubmit}
          initialValues={{
            stageNo: 'validate'
          }}
        >
          <Form.Item name="stageNo" label="阶段编号" rules={[{ required: true, message: '请选择阶段编号' }]}>
            <Select placeholder="请选择阶段编号">
              {eventStageOptions.map((option: any) => (
                <Select.Option key={option.itemNo} value={option.itemNo}>
                  {option.itemDescribe}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="stageName" label="阶段名称" rules={[{ required: true, message: '请输入阶段名称' }]}>
            <Input placeholder="请输入阶段名称" />
          </Form.Item>

          <Form.Item name="stageBean" label="阶段组件" rules={[{ required: true, message: '请选择阶段组件' }]}>
            <Select 
              placeholder="请选择阶段组件" 
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {stageBeanOptions.map(option => (
                <Select.Option key={option.itemNo} value={option.itemNo}>
                  {option.itemDescribe}-{option.itemNo}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="stageParam" label="阶段参数">
            <Input placeholder="请输入阶段参数（可选）" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingStage ? '更新' : '创建'}
              </Button>
              <Button onClick={() => setStageModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 阶段查看模态框 */}
      <Modal
        title="阶段详情"
        open={stageViewModalVisible}
        onCancel={() => setStageViewModalVisible(false)}
        footer={null}
        width={800}
      >
        {viewingStage && (
          <Descriptions 
            bordered 
            column={2}
            size="middle"
          >
            <Descriptions.Item label="阶段ID" span={2}>
              <Tag color="blue">{viewingStage.id}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="事件编号">
              <Tag color="green">{viewingStage.eventNo}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="版本代码">
              <Tag color="purple">{currentVersion?.versionCode || '无'}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="阶段编号">
              <Tag color="orange">
                {getDictText(eventStageOptions, viewingStage.stageNo)}
              </Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="阶段名称">
              <strong>{viewingStage.stageName}</strong>
            </Descriptions.Item>
            
            <Descriptions.Item label="阶段组件" span={2}>
              <div style={{ 
                padding: '8px 12px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '4px',
                fontFamily: 'monospace',
                minHeight: '40px'
              }}>
                {(() => {
                  const beanStr = String(viewingStage.stageBean || '');
                  const dictText = getDictText(stageBeanOptions, beanStr);
                  return dictText ? `${beanStr}-${dictText}` : beanStr || '无';
                })()}
              </div>
            </Descriptions.Item>
            
            <Descriptions.Item label="阶段参数" span={2}>
              <div style={{ 
                padding: '8px 12px', 
                backgroundColor: '#fff7e6', 
                borderRadius: '4px',
                fontFamily: 'monospace',
                minHeight: '40px'
              }}>
                {viewingStage.stageParam || '无'}
              </div>
            </Descriptions.Item>
            
            <Descriptions.Item label="创建时间">
              {moment(viewingStage.createdDate).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            
            <Descriptions.Item label="创建人">
              <Tag color="cyan">{viewingStage.createdBy || '未知'}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="最后修改时间">
              {viewingStage.lastModifiedDate ? 
                moment(viewingStage.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss') : 
                '无'
              }
            </Descriptions.Item>
            
            <Descriptions.Item label="最后修改人">
              <Tag color="magenta">{viewingStage.lastModifiedBy || '未知'}</Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 语句依赖编辑模态框 */}
      <Modal
        title={editingStatementDependency ? '编辑语句依赖' : '新增语句依赖'}
        open={statementDependencyModalVisible}
        onCancel={() => setStatementDependencyModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={statementDependencyForm}
          layout="vertical"
          onFinish={handleStatementDependencySubmit}
        >
          <Form.Item name="statementNo" label="语句编号" rules={[{ required: true }]}>
            <Select 
              placeholder="请选择语句编号" 
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => {
                const text = String(option?.children || '');
                return text.toLowerCase().includes(input.toLowerCase());
              }}
              onChange={(value) => {
                // 更新选中的语句编号状态
                setSelectedStatementNo(value);
                // 当第一个下拉框选择改变时，清空第二个下拉框的选择
                const currentDependValue = statementDependencyForm.getFieldValue('dependStatementNo');
                if (currentDependValue === value) {
                  statementDependencyForm.setFieldValue('dependStatementNo', undefined);
                }
              }}
            >
              {statementOptions.map((statement) => (
                <Select.Option key={statement.statementNo} value={statement.statementNo}>
                  {statement.statementNo} {statement.statementDesc ? `- ${statement.statementDesc}` : ''}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="dependStatementNo" label="依赖语句编号" rules={[{ required: true }]}>
            <Select 
              placeholder="请选择依赖语句编号" 
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => {
                const text = String(option?.children || '');
                return text.toLowerCase().includes(input.toLowerCase());
              }}
            >
              {statementOptions
                .filter((statement) => {
                  // 过滤掉第一个下拉框已选择的语句编号
                  return statement.statementNo !== selectedStatementNo;
                })
                .map((statement) => (
                  <Select.Option key={statement.statementNo} value={statement.statementNo}>
                    {statement.statementNo} {statement.statementDesc ? `- ${statement.statementDesc}` : ''}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingStatementDependency ? '更新' : '创建'}
              </Button>
              <Button onClick={() => setStatementDependencyModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 语句依赖查看模态框 */}
      <Modal
        title="语句依赖详情"
        open={statementDependencyViewModalVisible}
        onCancel={() => setStatementDependencyViewModalVisible(false)}
        footer={null}
        width={800}
      >
        {viewingStatementDependency && (
          <Descriptions 
            bordered 
            column={2}
            size="middle"
          >
            <Descriptions.Item label="依赖ID" span={2}>
              <Tag color="blue">{viewingStatementDependency.id}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="事件编号">
              <Tag color="green">{viewingStatementDependency.eventNo}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="版本代码">
              <Tag color="purple">{viewingStatementDependency.versionCode || '无'}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="语句编号">
              <Tag color="orange">{viewingStatementDependency.statementNo}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="语句描述" span={2}>
              <div style={{ 
                padding: '8px 12px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '4px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {viewingStatementDependency.statementDesc || '无'}
              </div>
            </Descriptions.Item>
            
            <Descriptions.Item label="依赖语句编号">
              <Tag color="cyan">{viewingStatementDependency.dependStatementNo}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="依赖语句描述" span={2}>
              <div style={{ 
                padding: '8px 12px', 
                backgroundColor: '#f0f0f0', 
                borderRadius: '4px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {viewingStatementDependency.dependStatementDesc || '无'}
              </div>
            </Descriptions.Item>
            
            <Descriptions.Item label="是否启用">
              <Tag color={viewingStatementDependency.enable === 'Y' ? 'green' : 'red'}>
                {viewingStatementDependency.enable === 'Y' ? '是' : '否'}
              </Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="创建时间">
              {moment(viewingStatementDependency.createdDate).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            
            <Descriptions.Item label="创建人">
              <Tag color="cyan">{viewingStatementDependency.createdBy || '未知'}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="最后修改时间">
              {viewingStatementDependency.lastModifiedDate ? 
                moment(viewingStatementDependency.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss') : 
                '无'
              }
            </Descriptions.Item>
            
            <Descriptions.Item label="最后修改人">
              <Tag color="magenta">{viewingStatementDependency.lastModifiedBy || '未知'}</Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 事件指标编辑模态框 */}
      <Modal
        title={editingEventIndicator ? '编辑事件指标' : '新增事件指标'}
        open={eventIndicatorModalVisible}
        onCancel={() => setEventIndicatorModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={eventIndicatorForm}
          layout="vertical"
          onFinish={handleEventIndicatorSubmit}
        >
          <Form.Item name="eventNo" label="事件编号" rules={[{ required: true }]}>
            <Input placeholder="请输入事件编号" disabled={true} />
          </Form.Item>
          
          <Form.Item name="indicatorNo" label="指标编号" rules={[{ required: true }]}>
            <Select
              showSearch
              placeholder="请搜索并选择指标编号"
              optionFilterProp="children"
              loading={indicatorSearchLoading}
              onSearch={handleIndicatorSearch}
              filterOption={false}
              notFoundContent={indicatorSearchLoading ? '搜索中...' : '请输入关键词搜索指标'}
              style={{ width: '100%' }}
            >
              {indicatorOptions.map((indicator) => (
                <Select.Option key={indicator.indicatorNo} value={indicator.indicatorNo}>
                  {indicator.indicatorNo} - {indicator.indicatorName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingEventIndicator ? '更新' : '创建'}
              </Button>
              <Button onClick={() => setEventIndicatorModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 创建版本模态框 */}
      <Modal
        title="创建新版本"
        open={createVersionModalVisible}
        onCancel={() => {
          setCreateVersionModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateVersion}
        >
          <Form.Item
            name="versionCode"
            label="版本代码"
            rules={[{ required: true, message: '请输入版本代码' }]}
          >
            <Input placeholder="请输入版本代码，如：v1.0.0" />
          </Form.Item>
          
          <Form.Item
            name="versionDesc"
            label="版本描述"
          >
            <Input.TextArea 
              placeholder="请输入版本描述" 
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 复制版本模态框 */}
      <Modal
        title="复制版本"
        open={copyVersionModalVisible}
        onCancel={() => {
          setCopyVersionModalVisible(false);
          copyVersionForm.resetFields();
          setCopyingVersion(null);
        }}
        onOk={() => copyVersionForm.submit()}
        width={600}
      >
        <Form
          form={copyVersionForm}
          layout="vertical"
          onFinish={handleCopyVersionSubmit}
        >
          <Form.Item
            name="versionCode"
            label="版本代码"
            rules={[{ required: true, message: '请输入版本代码' }]}
          >
            <Input placeholder="请输入版本代码，如：v1.0.0" />
          </Form.Item>
          
          <Form.Item
            name="versionDesc"
            label="版本描述"
          >
            <Input.TextArea 
              placeholder="请输入版本描述" 
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 变更记录模态框 */}
      <Modal
        title="变更记录"
        open={changeLogModalVisible}
        onCancel={() => setChangeLogModalVisible(false)}
        footer={null}
        width={1000}
      >
        <ProTable
          columns={[
            {
              title: '变更类型',
              dataIndex: 'changeType',
              key: 'changeType',
              width: 100,
            },
            {
              title: '配置类型',
              dataIndex: 'configType',
              key: 'configType',
              width: 120,
              search: false,
            },
            {
              title: '字段名',
              dataIndex: 'fieldName',
              key: 'fieldName',
              width: 120,
              search: false,
            },
            {
              title: '原值',
              dataIndex: 'oldValue',
              key: 'oldValue',
              width: 150,
              search: false,
              render: (text: string) => text ? text.substring(0, 50) + (text.length > 50 ? '...' : '') : '-',
            },
            {
              title: '新值',
              dataIndex: 'newValue',
              key: 'newValue',
              width: 150,
              search: false,
              render: (text: string) => text ? text.substring(0, 50) + (text.length > 50 ? '...' : '') : '-',
            },
            {
              title: '变更原因',
              dataIndex: 'changeReason',
              key: 'changeReason',
              width: 200,
              search: false,
            },
            {
              title: '变更时间',
              dataIndex: 'createdDate',
              key: 'createdDate',
              width: 150,
              search: false,
              render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm'),
            },
          ]}
          dataSource={changeLogs}
          rowKey="id"
          pagination={false}
        />
      </Modal>

      {/* 版本历史模态框 */}
      <Modal
        title="版本历史"
        open={versionHistoryVisible}
        onCancel={() => setVersionHistoryVisible(false)}
        footer={null}
        width={1000}
      >
        <ProTable
          actionRef={versionHistoryActionRef}
          request={async (params) => {
            console.log('版本历史表格 request 被调用，参数:', params);
            try {
              const { versionApi } = await import('@/services/eventConfigVersion');
              const response = await versionApi.getVersionHistoryPage(eventNo, {
                versionCode: params.versionCode,
                versionDesc: params.versionDesc,
                status: params.status,
                current: params.current || 1,
                pageSize: params.pageSize || 10,
              });
              console.log('版本历史分页查询结果:', response);
              return {
                data: response.records || [],
                success: true,
                total: response.total || 0,
              };
            } catch (error) {
              console.error('获取版本历史失败:', error);
              message.error('获取版本历史失败');
              return {
                data: [],
                success: false,
                total: 0,
              };
            }
          }}
          columns={[
            {
              title: '版本代码',
              dataIndex: 'versionCode',
              key: 'versionCode',
              width: 80,
              search: {
                placeholder: '请输入版本代码',
                allowClear: true,
              },
            },
            {
              title: '版本描述',
              dataIndex: 'versionDesc',
              key: 'versionDesc',
              width: 120,
              search: {
                placeholder: '请输入版本描述',
                allowClear: true,
              },
              ellipsis: true,
              render: (text: string) => (
                <Tooltip placement="topLeft">
                  <div style={{ 
                    maxWidth: '200px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}>
                    {text || '-'}
                  </div>
                </Tooltip>
              ),
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              width: 80,
              search: {
                placeholder: '请选择状态',
                allowClear: true,
              },
              valueType: 'select',
              valueEnum: convertDictToValueEnum(versionStatusOptions),
              render: (status: string) => {
                return getDictText(versionStatusOptions, status);
              },
            },
            {
              title: '创建人',
              dataIndex: 'createdBy',
              key: 'createdBy',
              width: 80,
              search: false,
            },
            {
              title: '创建时间',
              dataIndex: 'createdDate',
              key: 'createdDate',
              width: 160,
              search: false,
              render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
              title: '最后修改人',
              dataIndex: 'lastModifiedBy',
              key: 'lastModifiedBy',
              width: 90,
              search: false,
              render: (text: string) => text || '-',
            },
            {
              title: '最后修改时间',
              dataIndex: 'lastModifiedDate',
              key: 'lastModifiedDate',
              width: 160,
              search: false,
              render: (date: string) => {
                if (!date) return '-';
                const momentDate = moment(date);
                return momentDate.isValid() ? momentDate.format('YYYY-MM-DD HH:mm:ss') : '-';
              },
            },
            {
              title: '操作',
              key: 'action',
              width: 150,
              search: false,
              render: (_: any, record: EventConfigVersion) => (
                <Space>
                  <a onClick={() => handleVersionSelect(record.id)}>选择</a>
                  {(record.status === 'DRAFT' || record.status === 'APPROVED') && (
                    <a onClick={() => handleActivateVersion(record.id)}>激活</a>
                  )}
                  {(record.status !== 'DRAFT') && !hasDraftVersion() && (
                    <a onClick={() => handleCopyVersion(record.id)}>复制</a>
                  )}
                  
                  {record.status === 'ARCHIVED' && (
                    <a onClick={() => handleRollbackVersion(record.id)}>回滚</a>
                  )}
                  {record.status === 'DRAFT' && (
                    <a 
                      style={{ color: '#ff4d4f' }}
                      onClick={() => handleDeleteDraftVersion(record.id)}
                    >
                      删除
                    </a>
                  )}
                </Space>
              ),
            },
          ]}
          rowKey="id"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Modal>

      {/* 指标详情弹窗 */}
      <Modal
        title="指标详情"
        open={indicatorDetailVisible}
        onCancel={() => setIndicatorDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIndicatorDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedIndicator && (
          <div>
            {/* 指标详情卡片 */}
            <Card 
              title={<Typography.Title level={4} style={{ margin: 0 }}>指标信息</Typography.Title>}
              style={{ marginBottom: 16 }}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <strong>指标编号：</strong>
                    <Tag color="blue">{selectedIndicator.indicatorNo}</Tag>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <strong>指标名称：</strong>
                    <span>{selectedIndicator.indicatorName || '-'}</span>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <strong>查询编号：</strong>
                    <span>{selectedIndicator.queryNo || '-'}</span>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <strong>指标字段：</strong>
                    <span>{selectedIndicator.indicatorField || '-'}</span>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <strong>创建时间：</strong>
                    <span>{moment(selectedIndicator.createdDate).format('YYYY-MM-DD HH:mm:ss')}</span>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <strong>创建人：</strong>
                    <span>{selectedIndicator.createdBy || '-'}</span>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <strong>最后修改：</strong>
                    <span>{selectedIndicator.lastModifiedDate ? moment(selectedIndicator.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <strong>最后修改人：</strong>
                    <span>{selectedIndicator.lastModifiedBy ? selectedIndicator.lastModifiedBy : '-'}</span>
                  </div>
                </Col>
              </Row>
              
              <div style={{ marginTop: 16 }}>
                <strong>指标描述：</strong>
                <div style={{ 
                  marginTop: 8, 
                  padding: 12, 
                  backgroundColor: '#f9f9f9', 
                  borderRadius: 4,
                  minHeight: 40,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {selectedIndicator.indicatorDesc || '-'}
                </div>
              </div>
              
              <div style={{ marginTop: 16 }}>
                <strong>查询字段：</strong>
                <div style={{ 
                  marginTop: 8, 
                  padding: 12, 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: 4,
                  minHeight: 40
                }}>
                  {selectedIndicator.queryField || '-'}
                </div>
              </div>

            </Card>

            {/* 关联语句信息卡片 */}
            <Card 
              title={<Typography.Title level={4} style={{ margin: 0 }}>关联语句信息-{selectedStatement?.statementNo}</Typography.Title>}
              style={{ marginBottom: 16 }}
            >
              {selectedStatement ? (
                <div>
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <div style={{ marginBottom: 8 }}>
                        <Tag color="blue">语句编号：</Tag>
                        <span>{selectedStatement.statementNo}</span>
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>语句ID：</strong>
                        <span>{selectedStatement.id}</span>
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>语句描述：</strong>
                        <span>{selectedStatement.statementDesc || '未设置'}</span>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ marginBottom: 8 }}>
                        <strong>数据源编号：</strong>
                        <span>{selectedStatement.dataSourceNo || '未设置'}</span>
                      </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>Bean ID：</strong>
                      <span>{selectedStatement.beanId || '未设置'}</span>
                    </div>
                    {/* MongoDB特殊字段 */}
                    {selectedDataSource?.dataSourceType === 'MongoDB' && (
                      <>
                        <div style={{ marginBottom: 8 }}>
                          <strong>MongoDB操作类型：</strong>
                          <Tag color="green">{selectedStatement.mongoOperationType || '未设置'}</Tag>
                        </div>
                      </>
                    )}
                  </Col>
                </Row>
                {selectedDataSource?.dataSourceType === 'MongoDB' && (
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>MongoDB数据库：</strong>
                      <span>{selectedStatement.mongoDatabase || '未设置'}</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>MongoDB集合：</strong>
                      <span>{selectedStatement.mongoCollection || '未设置'}</span>
                    </div>
                  </Col>
                </Row>
                )}

                  <div style={{ marginTop: 16 }}>
                    <strong>结果字段：</strong>
                    <pre style={{ 
                      marginTop: 4, 
                      padding: 8, 
                      backgroundColor: '#fff', 
                      borderRadius: 2,
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      maxHeight: '100px',
                      overflow: 'auto',
                      border: '1px solid #d9d9d9',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      margin: 0
                    }}>
                      {selectedStatement.resultList || '暂无结果字段'}
                    </pre>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <strong>语句内容：</strong>
                      <Button 
                        type="link" 
                        size="small" 
                        onClick={() => {
                          Modal.info({
                            title: '语句内容详情',
                            width: '80%',
                            content: (
                              <pre style={{
                                background: '#f5f5f5',
                                padding: '16px',
                                borderRadius: '6px',
                                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                                margin: 0,
                                maxHeight: '70vh',
                                overflow: 'auto',
                                border: '1px solid #d9d9d9'
                              }}>
                                {selectedStatement.statementString || '暂无语句内容'}
                              </pre>
                            ),
                            okText: '关闭'
                          });
                        }}
                        style={{ padding: 0, height: 'auto' }}
                      >
                        查看详情
                      </Button>
                    </div>
                    <pre style={{ 
                      marginTop: 4, 
                      padding: 8, 
                      backgroundColor: '#fff', 
                      borderRadius: 2,
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      maxHeight: '100px',
                      overflow: 'auto',
                      border: '1px solid #d9d9d9',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      margin: 0,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      Modal.info({
                        title: '语句内容详情',
                        width: '80%',
                        content: (
                          <pre style={{
                            background: '#f5f5f5',
                            padding: '16px',
                            borderRadius: '6px',
                            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            margin: 0,
                            maxHeight: '70vh',
                            overflow: 'auto',
                            border: '1px solid #d9d9d9'
                          }}>
                            {selectedStatement.statementString || '暂无语句内容'}
                          </pre>
                        ),
                        okText: '关闭'
                      });
                    }}
                    title="点击查看完整语句内容"
                    >
                      {selectedStatement.statementString || '暂无语句内容'}
                    </pre>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <strong>参数配置：</strong>
                      <Button 
                        type="link" 
                        size="small" 
                        onClick={() => {
                          Modal.info({
                            title: '参数配置详情',
                            width: '80%',
                            content: (
                              <pre style={{
                                background: '#f5f5f5',
                                padding: '16px',
                                borderRadius: '6px',
                                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                                margin: 0,
                                maxHeight: '70vh',
                                overflow: 'auto',
                                border: '1px solid #d9d9d9'
                              }}>
                                {selectedStatement.statementParam || '暂无参数配置'}
                              </pre>
                            ),
                            okText: '关闭'
                          });
                        }}
                        style={{ padding: 0, height: 'auto' }}
                      >
                        查看详情
                      </Button>
                    </div>
                    <pre style={{ 
                      marginTop: 4, 
                      padding: 8, 
                      backgroundColor: '#fff', 
                      borderRadius: 2,
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      maxHeight: '60px',
                      overflow: 'auto',
                      border: '1px solid #d9d9d9',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      margin: 0,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      Modal.info({
                        title: '参数配置详情',
                        width: '80%',
                        content: (
                          <pre style={{
                            background: '#f5f5f5',
                            padding: '16px',
                            borderRadius: '6px',
                            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            margin: 0,
                            maxHeight: '70vh',
                            overflow: 'auto',
                            border: '1px solid #d9d9d9'
                          }}>
                            {selectedStatement.statementParam || '暂无参数配置'}
                          </pre>
                        ),
                        okText: '关闭'
                      });
                    }}
                    title="点击查看完整参数配置"
                    >
                      {selectedStatement.statementParam || '暂无参数配置'}
                    </pre>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#999', textAlign: 'center', padding: '20px 0' }}>
                  {selectedIndicator.queryNo ? '关联语句信息获取失败' : '暂无关联语句'}
                </div>
              )}
            </Card>

            {/* 数据源信息卡片 */}
            <Card 
              title={<Typography.Title level={4} style={{ margin: 0 }}>数据源信息-{selectedDataSource?.dataSourceNo}</Typography.Title>}
            >
              {selectedDataSource ? (
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>数据源编号：</strong>
                      <Tag color="blue">{selectedDataSource.dataSourceNo}</Tag>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>数据源名称：</strong>
                      <span>{selectedDataSource.dataSourceName || '未设置'}</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>数据源类型：</strong>
                      <span>{selectedDataSource.dataSourceType || '未设置'}</span>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>用户名：</strong>
                      <span>{selectedDataSource.dataSourceUserName || '未设置'}</span>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>连接字符串：</strong>
                      <div style={{ 
                        marginTop: 4, 
                        padding: '8px 12px', 
                        backgroundColor: '#f5f5f5', 
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        wordBreak: 'break-all',
                        maxHeight: '100px',
                        overflow: 'auto'
                      }}>
                        {selectedDataSource.dataSourceConnectString || '未设置'}
                      </div>
                    </div>
                  </Col>
                </Row>
              ) : (
                <div style={{ color: '#999', textAlign: 'center', padding: '20px 0' }}>
                  {selectedStatement?.dataSourceNo ? '数据源信息获取失败' : '暂无数据源信息'}
                </div>
              )}
            </Card>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default EventConfig;