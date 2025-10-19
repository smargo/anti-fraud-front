/**
 * FieldViewModal 组件
 */

import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import moment from 'moment';
import { getDictText, type DictItem } from '@/utils/dictUtils';
import type { FieldItem } from '../types';

interface FieldViewModalProps {
  visible: boolean;
  viewingField: FieldItem | null;
  fieldTypeOptions: DictItem[];
  onCancel: () => void;
}

const FieldViewModal: React.FC<FieldViewModalProps> = ({
  visible,
  viewingField,
  fieldTypeOptions,
  onCancel,
}) => {
  return (
    <Modal
      title="事件字段详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      {viewingField && (
        <Descriptions 
          bordered 
          column={2}
          size="middle"
        >
          <Descriptions.Item label="字段ID" span={2}>
            <Tag color="blue">{viewingField.id}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="事件编号">
            <Tag color="green">{viewingField.eventNo}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="版本代码">
            <Tag color="purple">{viewingField.versionCode}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="字段名称">
            <strong>{viewingField.fieldName}</strong>
          </Descriptions.Item>
          
          <Descriptions.Item label="字段类型">
            <Tag color="orange">
              {getDictText(fieldTypeOptions, viewingField.fieldType)}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="字段描述" span={2}>
            <div style={{ 
              padding: '8px 12px', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '4px',
              minHeight: '40px'
            }}>
              {viewingField.fieldDesc || '无描述'}
            </div>
          </Descriptions.Item>
          
          
          <Descriptions.Item label="验证脚本" span={2}>
            <div style={{ 
              padding: '8px 12px', 
              backgroundColor: '#fff7e6', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              minHeight: '60px',
              whiteSpace: 'pre-wrap'
            }}>
              {viewingField.validateScript || '无验证脚本'}
            </div>
          </Descriptions.Item>
          
          <Descriptions.Item label="创建时间">
            {moment(viewingField.createdDate).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          
          <Descriptions.Item label="创建人">
            <Tag color="cyan">{viewingField.createdBy || '未知'}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="最后修改时间">
            {viewingField.lastModifiedDate ? 
              moment(viewingField.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss') : 
              '无'
            }
          </Descriptions.Item>
          
          <Descriptions.Item label="最后修改人">
            <Tag color="magenta">{viewingField.lastModifiedBy || '未知'}</Tag>
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default FieldViewModal;

