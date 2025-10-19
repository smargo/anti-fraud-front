/**
 * EventDetailViewModal 组件
 */

import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import moment from 'moment';
import { getDictText } from '@/utils/dictUtils';
import { formatProcessTime, getStatusColor, getResultColor } from '../helper';
import type { EventDetailItem } from '../types';

interface EventDetailViewModalProps {
  visible: boolean;
  viewingEventDetail: EventDetailItem | null;
  eventTypeOptions: any[];
  statusOptions: any[];
  resultOptions: any[];
  onCancel: () => void;
}

const EventDetailViewModal: React.FC<EventDetailViewModalProps> = ({
  visible,
  viewingEventDetail,
  eventTypeOptions,
  statusOptions,
  resultOptions,
  onCancel,
}) => {
  return (
    <Modal
      title="事件详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      {viewingEventDetail && (
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="事件ID" span={2}>
            <Tag color="blue">{viewingEventDetail.id}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="事件流水号">
            <Tag color="green">{viewingEventDetail.eventTransNo}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="事件编号">
            <Tag color="purple">{viewingEventDetail.eventNo}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="事件类型">
            <Tag color="orange">
              {getDictText(eventTypeOptions || [], viewingEventDetail.eventType)}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="事件来源">
            <Tag color="cyan">{viewingEventDetail.source}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="事件内容" span={2}>
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {viewingEventDetail.content || '无'}
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="事件时间">
            {viewingEventDetail.eventTime
              ? moment(viewingEventDetail.eventTime).format('YYYY-MM-DD HH:mm:ss')
              : '无'}
          </Descriptions.Item>

          <Descriptions.Item label="处理状态">
            <Tag color={getStatusColor(viewingEventDetail.status)}>
              {getDictText(statusOptions || [], viewingEventDetail.status)}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="处理结果">
            <Tag color={getResultColor(viewingEventDetail.result)}>
              {getDictText(resultOptions || [], viewingEventDetail.result)}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="拒绝码">
            <Tag color="red">{viewingEventDetail.rejectCode || '无'}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="处理时间">
            {formatProcessTime(viewingEventDetail.processTime)}
          </Descriptions.Item>

          <Descriptions.Item label="重试次数">
            <Tag color="orange">{viewingEventDetail.retryCount}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="结果内容" span={2}>
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {viewingEventDetail.resultContent || '无'}
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="错误信息" span={2}>
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#fff2f0',
                borderRadius: '4px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: '#ff4d4f',
              }}
            >
              {viewingEventDetail.errorMessage || '无'}
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="创建时间">
            {viewingEventDetail.createdDate
              ? moment(viewingEventDetail.createdDate).format('YYYY-MM-DD HH:mm:ss')
              : '无'}
          </Descriptions.Item>

          <Descriptions.Item label="创建人">
            <Tag color="cyan">{viewingEventDetail.createdBy}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="最后修改时间">
            {viewingEventDetail.lastModifiedDate
              ? moment(viewingEventDetail.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss')
              : '无'}
          </Descriptions.Item>

          <Descriptions.Item label="最后修改人">
            <Tag color="magenta">{viewingEventDetail.lastModifiedBy}</Tag>
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default EventDetailViewModal;
