import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-table';
import { Card, Button, Space, Modal, Descriptions, Tag, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { queryStages } from '@/services/stage';
import { useDictData } from '@/hooks/useDictData';
import { convertDictToValueEnum, getDictText } from '@/utils/dictUtils';
import moment from 'moment';

interface StageItem {
  id: string;
  eventNo: string;
  stageNo: string;
  stageName: string;
  stageBean: string;
  stageParam: string;
  versionCode?: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

// 定义需要加载的字典代码列表
const DICT_CODE_LIST = ['event_stage_option'];

const StageList: React.FC = () => {
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingStage, setViewingStage] = useState<StageItem | null>(null);

  // 使用字典数据管理Hook
  const { getDictOptions } = useDictData(DICT_CODE_LIST);
  
  // 获取阶段选项
  const stageOptions = getDictOptions('event_stage_option');

  const handleView = (record: StageItem) => {
    setViewingStage(record);
    setViewModalVisible(true);
  };

  const actionRef = useRef<ActionType>();
  
  const columns = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 120,
      search: {
        placeholder: '请输入事件编号',
        allowClear: true,
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
      title: '处理阶段',
      dataIndex: 'stageNo',
      key: 'stageNo',
      width: 120,
      render: (stage: string) => {
        return getDictText(stageOptions, stage);
      },
      search: {
        valueType: 'select',
        valueEnum: convertDictToValueEnum(stageOptions),
        placeholder: '请选择处理阶段',
        allowClear: true,
      },
    },
    {
      title: '处理名称',
      dataIndex: 'stageName',
      key: 'stageName',
      width: 150,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip placement="topLeft">
          <div style={{ 
            maxWidth: '120px', 
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
      title: '处理组件',
      dataIndex: 'stageBean',
      key: 'stageBean',
      width: 150,
      ellipsis: true,
      render: (bean: string) => (
        <Tooltip placement="topLeft">
          <div style={{ 
            maxWidth: '120px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {bean || '无'}
          </div>
        </Tooltip>
      ),
      search: false,
    },
    {
      title: '阶段参数',
      dataIndex: 'stageParam',
      key: 'stageParam',
      width: 120,
      ellipsis: true,
      render: (statementNo: string) => (
        <Tooltip placement="topLeft">
          <div style={{ 
            maxWidth: '100px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {statementNo || '无'}
          </div>
        </Tooltip>
      ),
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 80,
      fixed: 'right',
      render: (_: any, record: StageItem) => (
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
            
            const response = await queryStages(searchParams);
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
          title="阶段详情"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
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
                <Tag color="purple">{viewingStage.versionCode || '无'}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="处理阶段">
                <Tag color="orange">
                  {getDictText(stageOptions, viewingStage.stageNo)}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="处理名称">
                <strong>{viewingStage.stageName}</strong>
              </Descriptions.Item>
              
              <Descriptions.Item label="处理组件" span={2}>
                <div style={{ 
                  padding: '8px 12px', 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  minHeight: '40px'
                }}>
                  {viewingStage.stageBean || '无'}
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
      </Card>
    </PageContainer>
  );
};


export default StageList;