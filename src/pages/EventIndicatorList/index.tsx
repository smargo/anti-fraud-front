import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-table';
import { Card, Button, Space, Modal, Descriptions, Tag, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { queryEventIndicatorsWithNames, EventIndicatorWithNamesItem } from '@/services/eventIndicator';
import moment from 'moment';

const EventIndicatorList: React.FC = () => {
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingRelation, setViewingRelation] = useState<EventIndicatorWithNamesItem | null>(null);
  
  // 创建actionRef用于控制表格
  const actionRef = useRef<ActionType>();

  const handleView = (record: EventIndicatorWithNamesItem) => {
    setViewingRelation(record);
    setViewModalVisible(true);
  };

  const columns = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 120,
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
      title: '事件名称',
      dataIndex: 'eventName',
      key: 'eventName',
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
      search: {
        allowClear: true,
        placeholder: '请输入事件名称',
      },
    },
    {
      title: '指标编号',
      dataIndex: 'indicatorNo',
      key: 'indicatorNo',
      width: 150,
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
      search: {
        allowClear: true,
        placeholder: '请输入指标编号',
      },
    },
    {
      title: '指标名称',
      dataIndex: 'indicatorName',
      key: 'indicatorName',
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
      search: {
        allowClear: true,
        placeholder: '请输入指标名称',
      },
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 80,
      fixed: 'right',
      render: (_: any, record: EventIndicatorWithNamesItem) => (
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
            
            const response = await queryEventIndicatorsWithNames(searchParams);
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
          title="事件指标关联详情"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={null}
          width={800}
        >
          {viewingRelation && (
            <Descriptions 
              bordered 
              column={2}
              size="middle"
            >
              <Descriptions.Item label="关联ID">
                <Tag color="blue">{viewingRelation.id}</Tag>
              </Descriptions.Item>


              <Descriptions.Item label="版本代码">
                <Tag color="cyan">{viewingRelation.versionCode || '无'}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="事件编号">
                <Tag color="green">{viewingRelation.eventNo}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="事件名称">
                <Tag color="blue">{viewingRelation.eventName || '无'}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="指标编号">
                <Tag color="orange">{viewingRelation.indicatorNo}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="指标名称">
                <Tag color="purple">{viewingRelation.indicatorName || '无'}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="创建时间">
                {moment(viewingRelation.createdDate).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              
              <Descriptions.Item label="创建人">
                <Tag color="cyan">{viewingRelation.createdBy || '未知'}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="最后修改时间">
                {viewingRelation.lastModifiedDate ? 
                  moment(viewingRelation.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss') : 
                  '无'
                }
              </Descriptions.Item>
              
              <Descriptions.Item label="最后修改人">
                <Tag color="magenta">{viewingRelation.lastModifiedBy || '未知'}</Tag>
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </Card>
    </PageContainer>
  );
};


export default EventIndicatorList;