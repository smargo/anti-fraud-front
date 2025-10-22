/**
 * 阶段查看Modal组件 - 完全按照原页面逻辑实现
 */

import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import { getDictText } from '@/utils/dictUtils';
import moment from 'moment';
import type { StageViewModalProps } from '../../types';

const StageViewModal: React.FC<StageViewModalProps> = ({
  visible,
  viewingStage,
  eventStageOptions,
  stageBeanOptions,
  onCancel,
}) => {
  if (!viewingStage) return null;

  return (
    <Modal
      title="阶段详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
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
        
        <Descriptions.Item label="阶段编号">
          <Tag color="orange">
            {getDictText(eventStageOptions, viewingStage.stageNo)}
          </Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="阶段名称">
          <strong>{viewingStage.stageName}</strong>
        </Descriptions.Item>
        
        <Descriptions.Item label="阶段组件" span={2}>
          <div style={{ 
            padding: '8px 12px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '4px',
            fontFamily: 'monospace',
            minHeight: '40px'
          }}>
            {(() => {
              const beanStr = String(viewingStage.stageBean || '');
              const dictText = getDictText(stageBeanOptions, beanStr);
              return dictText ? `${beanStr}-${dictText}` : beanStr || '无';
            })()}
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
    </Modal>
  );
};

export default StageViewModal;
