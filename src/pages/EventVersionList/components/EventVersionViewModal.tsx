/**
 * EventVersionViewModal 组件
 */

import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import moment from 'moment';
import { getDictText, type DictItem } from '@/utils/dictUtils';
import type { EventVersionViewProps } from '../types';

const EventVersionViewModal: React.FC<EventVersionViewProps & { visible: boolean; onCancel: () => void }> = ({
  visible,
  viewingVersion,
  versionStatusOptions,
  eventTypeOptions,
  eventGroupOptions,
  onCancel,
}) => {
  return (
    <Modal
      title="版本详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      {viewingVersion && (
        <Descriptions column={2} bordered>
          <Descriptions.Item label="事件编号" span={2}>
            {viewingVersion.eventNo}
          </Descriptions.Item>
          <Descriptions.Item label="版本代码">
            {viewingVersion.versionCode}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color="default">
              {getDictText(versionStatusOptions, viewingVersion.status)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="事件类型">
            {getDictText(eventTypeOptions, viewingVersion.eventType || '') || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="事件分组">
            {getDictText(eventGroupOptions, viewingVersion.eventGroup || '') || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="版本描述" span={2}>
            {viewingVersion.versionDesc || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建人">
            {viewingVersion.createdBy}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {moment(viewingVersion.createdDate).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="最后修改人">
            {viewingVersion.lastModifiedBy || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="最后修改时间">
            {viewingVersion.lastModifiedDate 
              ? moment(viewingVersion.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss')
              : '-'
            }
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default EventVersionViewModal;
