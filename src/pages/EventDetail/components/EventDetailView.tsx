/**
 * EventDetailView 组件
 */

import React from 'react';
import { Card, Descriptions, Spin, Tag } from 'antd';
import { 
  formatDateTime, 
  formatProcessTime, 
  getStatusColor, 
  getResultColor, 
  statusMap, 
  resultMap, 
  eventTypeMap, 
  formatContent 
} from '../helper';
import type { EventDetailViewProps } from '../types';

const EventDetailView: React.FC<EventDetailViewProps> = ({ eventDetail, loading }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!eventDetail) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>事件记录不存在</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="事件详情记录">
      <Descriptions bordered column={2}>
        <Descriptions.Item label="事件流水号">{eventDetail.eventTransNo}</Descriptions.Item>
        <Descriptions.Item label="事件编号">{eventDetail.eventNo}</Descriptions.Item>
        <Descriptions.Item label="事件类型">{eventTypeMap[eventDetail.eventType] || eventDetail.eventType}</Descriptions.Item>
        <Descriptions.Item label="事件来源">{eventDetail.source}</Descriptions.Item>
        <Descriptions.Item label="事件时间">{formatDateTime(eventDetail.eventTime)}</Descriptions.Item>
        <Descriptions.Item label="处理状态">{statusMap[eventDetail.status] || eventDetail.status}</Descriptions.Item>
        <Descriptions.Item label="处理结果">
          <Tag color={getResultColor(eventDetail.result)}>
            {resultMap[eventDetail.result] || eventDetail.result}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="拒绝代码">{eventDetail.rejectCode || '-'}</Descriptions.Item>
        <Descriptions.Item label="处理耗时(毫秒)">{eventDetail.processTime || 0}</Descriptions.Item>
        <Descriptions.Item label="重试次数">{eventDetail.retryCount}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{formatDateTime(eventDetail.createdDate)}</Descriptions.Item>
        <Descriptions.Item label="创建人">{eventDetail.createdBy}</Descriptions.Item>
        <Descriptions.Item label="最后修改时间">{formatDateTime(eventDetail.lastModifiedDate)}</Descriptions.Item>
        <Descriptions.Item label="最后修改人">{eventDetail.lastModifiedBy}</Descriptions.Item>
        <Descriptions.Item label="决策返回内容" span={2}>{eventDetail.resultContent || '-'}</Descriptions.Item>
        <Descriptions.Item label="错误信息" span={2}>{eventDetail.errorMessage || '-'}</Descriptions.Item>
        <Descriptions.Item label="事件内容" span={2}>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{formatContent(eventDetail.content)}</pre>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default EventDetailView;

