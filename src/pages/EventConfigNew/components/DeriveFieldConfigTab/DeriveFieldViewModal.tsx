/**
 * 衍生字段查看Modal组件 - 完全按照原页面逻辑实现
 */

import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import { getDictText } from '@/utils/dictUtils';
import moment from 'moment';
import type { DeriveFieldViewModalProps } from '../../types';

const DeriveFieldViewModal: React.FC<DeriveFieldViewModalProps> = ({
  visible,
  viewingDeriveField,
  fieldTypeOptions,
  deriveFieldProcessTypeOptions,
  onCancel,
}) => {
  if (!viewingDeriveField) return null;

  return (
    <Modal
      title="衍生字段详情"
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
        <Descriptions.Item label="字段ID" span={2}>
          <Tag color="blue">{viewingDeriveField.id}</Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="事件编号">
          <Tag color="green">{viewingDeriveField.eventNo}</Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="版本代码">
          <Tag color="purple">{viewingDeriveField.versionCode || '-'}</Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="衍生字段名称">
          <strong>{viewingDeriveField.fieldName}</strong>
        </Descriptions.Item>
        
        <Descriptions.Item label="字段类型">
          <Tag color="orange">{getDictText(fieldTypeOptions, viewingDeriveField.fieldType)}</Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="字段描述" span={2}>
          <div style={{ 
            padding: '8px 12px', 
            backgroundColor: '#f6f8fa', 
            borderRadius: '4px',
            minHeight: '40px',
            whiteSpace: 'pre-wrap'
          }}>
            {viewingDeriveField.fieldDesc || '无描述'}
          </div>
        </Descriptions.Item>
        
        <Descriptions.Item label="处理类型">
          <Tag color="cyan">{getDictText(deriveFieldProcessTypeOptions, viewingDeriveField.processType)}</Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="处理类">
          <Tag color="magenta">{viewingDeriveField.processBean || '无'}</Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="衍生脚本" span={2}>
          <div style={{ 
            padding: '8px 12px', 
            backgroundColor: '#fff7e6', 
            borderRadius: '4px',
            fontFamily: 'monospace',
            minHeight: '60px',
            whiteSpace: 'pre-wrap'
          }}>
            {viewingDeriveField.processScript || '无衍生脚本'}
          </div>
        </Descriptions.Item>
        
        <Descriptions.Item label="创建时间">
          {moment(viewingDeriveField.createdDate).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
        
        <Descriptions.Item label="创建人">
          <Tag color="cyan">{viewingDeriveField.createdBy || '未知'}</Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="最后修改时间">
          {viewingDeriveField.lastModifiedDate ? 
            moment(viewingDeriveField.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss') : 
            '无'
          }
        </Descriptions.Item>
        
        <Descriptions.Item label="最后修改人">
          <Tag color="magenta">{viewingDeriveField.lastModifiedBy || '未知'}</Tag>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default DeriveFieldViewModal;
