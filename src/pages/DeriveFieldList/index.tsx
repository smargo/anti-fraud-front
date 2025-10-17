import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-table';
import { Card, Button, Space, Modal, Descriptions, Tag, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { queryDeriveFields } from '@/services/deriveField';
import { useDictData } from '@/hooks/useDictData';
import { convertDictToValueEnum, getDictText } from '@/utils/dictUtils';
import moment from 'moment';


interface DeriveFieldItem {
  id: string;
  eventNo: string;
  fieldName: string;
  fieldType: string;
  fieldDesc?: string;
  processType: string;
  processScript: string;
  processBean: string;
  versionCode: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

// 定义需要加载的字典代码列表
const DICT_CODE_LIST = ['event_field_type_option'];

const DeriveFieldList: React.FC = () => {
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingField, setViewingField] = useState<DeriveFieldItem | null>(null);

  // 使用字典数据管理Hook
  const { getDictOptions } = useDictData(DICT_CODE_LIST);
  
  // 获取字段类型选项
  const fieldTypeOptions = getDictOptions('event_field_type_option');

  const handleView = (record: DeriveFieldItem) => {
    setViewingField(record);
    setViewModalVisible(true);
  };

  const actionRef = useRef<ActionType>();


  const columns = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 120,
      search: true,
    },
    {
      title: '版本代码',
      dataIndex: 'versionCode',
      key: 'versionCode',
      width: 100,
      search: true,
    },
    {
      title: '衍生字段名称',
      dataIndex: 'fieldName',
      key: 'fieldName',
      width: 150,
      search: true,
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      key: 'fieldType',
      width: 100,
      render: (fieldType: any) => {
        return getDictText(fieldTypeOptions, fieldType);
      },
      valueType: 'select',
      valueEnum: convertDictToValueEnum(fieldTypeOptions),
    },
    {
      title: '字段描述',
      dataIndex: 'fieldDesc',
      key: 'fieldDesc',
      width: 150,
      ellipsis: true,
      render: (text: any) => (
        <Tooltip>
          <span>{text || '-'}</span>
        </Tooltip>
      ),
      search: true,
    },
    {
      title: '处理类型',
      dataIndex: 'processType',
      key: 'processType',
      width: 100,
      ellipsis: true,
      search: false,
    },
    {
      title: '衍生脚本',
      dataIndex: 'processScript',
      key: 'processScript',
      width: 150,
      ellipsis: true,
      render: (script: any) => (
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
            {script || '无衍生脚本'}
          </div>
        </Tooltip>
      ),
      search: false,
    },
    {
      title: '处理类',
      dataIndex: 'processBean',
      key: 'processBean',
      width: 120,
      ellipsis: true,
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 80,
      fixed: 'right' as const,
      render: (_: any, record: DeriveFieldItem) => (
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
            
            const response = await queryDeriveFields(searchParams);
            // 如果返回的是分页对象，直接返回
            return {
              data: response.records || [],
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
          title="衍生字段详情"
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
              
              <Descriptions.Item label="衍生字段名称">
                <strong>{viewingField.fieldName}</strong>
              </Descriptions.Item>
              
              <Descriptions.Item label="字段类型">
                <Tag color="orange">{viewingField.fieldType}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="字段描述" span={2}>
                <div style={{ 
                  padding: '8px 12px', 
                  backgroundColor: '#f6f8fa', 
                  borderRadius: '4px',
                  minHeight: '40px',
                  whiteSpace: 'pre-wrap'
                }}>
                  {viewingField.fieldDesc || '无描述'}
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="处理类型">
                <Tag color="cyan">{viewingField.processType}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="处理类">
                <Tag color="magenta">{viewingField.processBean || '无'}</Tag>
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
                  {viewingField.processScript || '无衍生脚本'}
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


export default DeriveFieldList;