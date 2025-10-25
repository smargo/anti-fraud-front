/**
 * 事件指标查看弹窗组件
 */

import { Descriptions, Modal, Tag } from 'antd';
import React from 'react';
import type { EventIndicatorViewModalProps } from '../../types';

const EventIndicatorViewModal: React.FC<EventIndicatorViewModalProps> = ({
  visible,
  viewingEventIndicator,
  onCancel,
}) => {
  if (!viewingEventIndicator) return null;

  return (
    <Modal title="查看事件指标" open={visible} onCancel={onCancel} footer={null} width={600}>
      <Descriptions column={2} bordered>
        <Descriptions.Item label="指标编号" span={2}>
          <Tag color="blue">{viewingEventIndicator.indicatorNo}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="指标名称" span={2}>
          {viewingEventIndicator.indicatorName}
        </Descriptions.Item>

        <Descriptions.Item label="事件名称" span={2}>
          {viewingEventIndicator.eventName || '-'}
        </Descriptions.Item>

        <Descriptions.Item label="创建时间" span={2}>
          {new Date(viewingEventIndicator.createdDate).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default EventIndicatorViewModal;
