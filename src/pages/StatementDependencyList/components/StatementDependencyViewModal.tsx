/**
 * StatementDependencyViewModal 组件
 */

import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import moment from 'moment';
import type { StatementDependencyItem } from '../types';

interface StatementDependencyViewModalProps {
  visible: boolean;
  viewingStatementDependency: StatementDependencyItem | null;
  onCancel: () => void;
}

const StatementDependencyViewModal: React.FC<StatementDependencyViewModalProps> = ({
  visible,
  viewingStatementDependency,
  onCancel,
}) => {
  return (
    <Modal
      title="语句依赖详情"
      open={visible}
      onCancel={onCancel}
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
  );
};

export default StatementDependencyViewModal;

