import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-table';
import { Card, Button, Space, Modal, Descriptions, Tag, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { queryEventFields } from '@/services/field';
import { useDictData } from '@/hooks/useDictData';
import { convertDictToValueEnum, getDictText } from '@/utils/dictUtils';
import moment from 'moment';

interface EventFieldItem {
  id: string;
  eventNo: string;
  fieldName: string;
  fieldType: string;
  fieldDesc: string;
  validateRegular: string;
  validateScript: string;
  versionCode: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

// 定义需要加载的字典代码列表 - 移到组件外部避免重复创建
const DICT_CODE_LIST = ['event_field_type_option'];

const FieldList: React.FC = () => {
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingField, setViewingField] = useState<EventFieldItem | null>(null);
  
  // 使用字典数据管理Hook
  const { getDictOptions, loading } = useDictData(DICT_CODE_LIST);
  
  // 获取字段类型选项
  const fieldTypeOptions = getDictOptions('event_field_type_option');

  const handleView = (record: EventFieldItem) => {
    setViewingField(record);
    setViewModalVisible(true);
  };

  const actionRef = useRef<ActionType>();
  
  // 表格列定义
  const columns = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 150,
      search: {
        placeholder: '请输入事件编号',
        allowClear: true,
      },
    },
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
      title: '字段名称',
      dataIndex: 'fieldName',
      key: 'fieldName',
      width: 120,
      search: {
        placeholder: '请输入字段名称',
        allowClear: true,
      },
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      key: 'fieldType',
      width: 80,
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
            {text || '无描述'}
          </div>
        </Tooltip>
      ),
      search: true,
    },
    {
      title: '验证脚本',
      dataIndex: 'validateScript',
      key: 'validateScript',
      width: 150,
      ellipsis: true,
      render: (script: string) => (
        <Tooltip  
          placement="topLeft"
        >
          <div style={{ 
            maxWidth: '150px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}>
            {script || '无验证脚本'}
          </div>
        </Tooltip>
      ),
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 160,
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width:100,
      render: (_: any, record: EventFieldItem) => (
        <Button 
          type="link" 
          onClick={() => handleView(record)}
        >
          查看
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <ProTable
          cardBordered
          actionRef={actionRef}
          toolBarRender={() => []}
          request={async (params) => {
            // 格式化搜索参数
            const searchParams = {
              ...params,
            };
            
            const response = await queryEventFields(searchParams);
            // 如果返回的是分页对象，直接返回
            return {
              data: response.records || response.data || [],
              total: response.total,
              success: true,
            };
          }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          columns={columns}
          rowKey="id"
        />

        {/* 查看弹窗 */}
        <Modal
          title="事件字段详情"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
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
                <Tag color="purple">{viewingField.versionCode}</Tag>
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
      </Card>
    </PageContainer>
  );
};

export default FieldList;