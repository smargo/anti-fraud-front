/**
 * EventIndicatorViewModal 组件
 */

import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import moment from 'moment';
import type { EventIndicatorItem } from '../types';

interface EventIndicatorViewModalProps {
  visible: boolean;
  viewingEventIndicator: EventIndicatorItem | null;
  onCancel: () => void;
}

const EventIndicatorViewModal: React.FC<EventIndicatorViewModalProps> = ({
  visible,
  viewingEventIndicator,
  onCancel,
}) => {
  return (
    <Modal
      title="事件指标关联详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      {viewingEventIndicator && (
        <Descriptions 
          bordered 
          column={2}
          size="middle"
        >
          <Descriptions.Item label="关联ID">
            <Tag color="blue">{viewingEventIndicator.id}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="版本代码">
            <Tag color="cyan">{viewingEventIndicator.versionCode || '无'}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="事件编号">
            <Tag color="green">{viewingEventIndicator.eventNo}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="事件名称">
            <Tag color="blue">{viewingEventIndicator.eventName || '无'}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="指标编号">
            <Tag color="orange">{viewingEventIndicator.indicatorNo}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="指标名称">
            <Tag color="purple">{viewingEventIndicator.indicatorName || '无'}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="创建时间">
            {moment(viewingEventIndicator.createdDate).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          
          <Descriptions.Item label="创建人">
            <Tag color="cyan">{viewingEventIndicator.createdBy || '未知'}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="最后修改时间">
            {viewingEventIndicator.lastModifiedDate ? 
              moment(viewingEventIndicator.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss') : 
              '无'
            }
          </Descriptions.Item>
          
          <Descriptions.Item label="最后修改人">
            <Tag color="magenta">{viewingEventIndicator.lastModifiedBy || '未知'}</Tag>
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default EventIndicatorViewModal;

