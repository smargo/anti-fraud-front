/**
 * IndicatorViewModal 组件
 */

import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import moment from 'moment';
import type { IndicatorItem } from '../types';

interface IndicatorViewModalProps {
  visible: boolean;
  viewingIndicator: IndicatorItem | null;
  onCancel: () => void;
}

const IndicatorViewModal: React.FC<IndicatorViewModalProps> = ({
  visible,
  viewingIndicator,
  onCancel,
}) => {
  return (
    <Modal
      title="指标详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      {viewingIndicator && (
        <Descriptions 
          bordered 
          column={2}
          size="middle"
        >
          <Descriptions.Item label="指标ID" span={2}>
            {viewingIndicator.id}
          </Descriptions.Item>
          
          <Descriptions.Item label="指标编号">
            <Tag color="green">{viewingIndicator.indicatorNo}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="指标名称">
            <Tag color="purple">{viewingIndicator.indicatorName}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="指标描述" span={2}>
            <div style={{ 
              padding: '8px 12px', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '4px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {viewingIndicator.indicatorDesc || '无'}
            </div>
          </Descriptions.Item>
          
          <Descriptions.Item label="指标字段" span={2}>
            <Tag color="orange">{viewingIndicator.indicatorField}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="查询字段" span={2}>
            <Tag color="cyan">{viewingIndicator.queryField}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="查询编号" span={2}>
            <Tag color="blue">{viewingIndicator.queryNo}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="创建时间">
            {moment(viewingIndicator.createdDate).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          
          <Descriptions.Item label="创建人">
            {viewingIndicator.createdBy || '无'}
          </Descriptions.Item>
          
          <Descriptions.Item label="最后修改时间">
            {viewingIndicator.lastModifiedDate ? 
              moment(viewingIndicator.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss') : 
              '无'
            }
          </Descriptions.Item>
          
          <Descriptions.Item label="最后修改人">
            {viewingIndicator.lastModifiedBy || '无'}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default IndicatorViewModal;

