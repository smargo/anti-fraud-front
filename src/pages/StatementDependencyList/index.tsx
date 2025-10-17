import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-table';
import { Card, Button, Space, Modal, Descriptions, Tag, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { queryStatementDependenciesWithNames, StatementDependencyWithNamesItem } from '@/services/statementDependency';
import { useDictData } from '@/hooks/useDictData';
import { convertDictToValueEnum, getDictText } from '@/utils/dictUtils';
import moment from 'moment';

// 使用扩展的接口
type StatementDependencyItem = StatementDependencyWithNamesItem;

// 定义需要加载的字典代码列表
const DICT_CODE_LIST = ['enable_option'];

const StatementDependencyList: React.FC = () => {
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingItem, setViewingItem] = useState<StatementDependencyItem | null>(null);
  
  // 使用字典数据管理Hook
  const { getDictOptions } = useDictData(DICT_CODE_LIST);
  
  // 获取启用选项
  const enableOptions = getDictOptions('enable_option');
  
  // 创建actionRef用于控制表格
  const actionRef = useRef<ActionType>();

  const handleView = (record: StatementDependencyItem) => {
    setViewingItem(record);
    setViewModalVisible(true);
  };

  // 表格列定义
  const columns = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 100,
      search: {
        allowClear: true,
        placeholder: '请输入事件编号',
      },
    },
    {
      title: '版本代码',
      dataIndex: 'versionCode',
      key: 'versionCode',
      width: 100,
      search: {
        placeholder: '请输入版本代码',
        allowClear: true,
      },
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
        allowClear: true,
        placeholder: '请输入语句编号',
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
      title: '是否启用',
      dataIndex: 'enable',
      key: 'enable',
      width: 80,
      render: (e: string) => {
        return getDictText(enableOptions, e);
      },
      search: {
        valueType: 'select',
        valueEnum: convertDictToValueEnum(enableOptions),
        placeholder: '请选择是否启用',
        allowClear: true,
      },
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 80,
      fixed: 'right',
      render: (_: any, record: StatementDependencyItem) => (
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
            
            const response = await queryStatementDependenciesWithNames(searchParams);
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
          title="语句依赖详情"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={null}
          width={800}
        >
          {viewingItem && (
            <Descriptions 
              bordered 
              column={2}
              size="middle"
            >
              <Descriptions.Item label="依赖ID" span={2}>
                <Tag color="blue">{viewingItem.id}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="事件编号">
                <Tag color="green">{viewingItem.eventNo}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="版本代码">
                <Tag color="purple">{viewingItem.versionCode || '无'}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="语句编号">
                <Tag color="orange">{viewingItem.statementNo}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="语句描述" span={2}>
                <div style={{ 
                  padding: '8px 12px', 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {viewingItem.statementDesc || '无'}
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="依赖语句编号">
                <Tag color="cyan">{viewingItem.dependStatementNo}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="依赖语句描述" span={2}>
                <div style={{ 
                  padding: '8px 12px', 
                  backgroundColor: '#f0f0f0', 
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {viewingItem.dependStatementDesc || '无'}
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="是否启用">
                <Tag color={viewingItem.enable === 'Y' ? 'green' : 'red'}>
                  {getDictText(enableOptions, viewingItem.enable)}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="创建时间">
                {moment(viewingItem.createdDate).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              
              <Descriptions.Item label="创建人">
                <Tag color="cyan">{viewingItem.createdBy || '未知'}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="最后修改时间">
                {viewingItem.lastModifiedDate ? 
                  moment(viewingItem.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss') : 
                  '无'
                }
              </Descriptions.Item>
              
              <Descriptions.Item label="最后修改人">
                <Tag color="magenta">{viewingItem.lastModifiedBy || '未知'}</Tag>
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </Card>
    </PageContainer>
  );
};


export default StatementDependencyList;