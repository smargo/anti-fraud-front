/**
 * 字段查看弹窗组件
 */

import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import moment from 'moment';
import type { FieldItem, FieldViewModalProps } from '../../types';

const FieldViewModal: React.FC<FieldViewModalProps> = ({
  visible,
  viewingField,
  fieldTypeOptions,
  onCancel,
}) => {
  const getFieldTypeText = (fieldType: string) => {
    const option = fieldTypeOptions.find((opt: any) => opt.itemNo === fieldType);
    return option ? option.itemDescribe : fieldType;
  };

  return (
    <Modal
      title="字段详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      {viewingField && (
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="字段ID" span={2}>
            <Tag color="blue">{viewingField.id}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="字段名称">
            <Tag color="green">{viewingField.fieldName}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="字段类型">
            <Tag color="purple">{getFieldTypeText(viewingField.fieldType)}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="字段描述" span={2}>
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {viewingField.fieldDesc || '无'}
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="验证正则" span={2}>
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '12px',
              }}
            >
              {viewingField.validateRegex || '无'}
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="验证脚本" span={2}>
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {viewingField.validateScript || '无'}
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="是否必填">
            <Tag color={viewingField.required ? 'red' : 'green'}>
              {viewingField.required ? '是' : '否'}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="创建时间">
            {moment(viewingField.createdDate).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>

          <Descriptions.Item label="创建人">
            <Tag color="cyan">{viewingField.createdBy || '未知'}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="最后修改时间">
            {viewingField.lastModifiedDate
              ? moment(viewingField.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss')
              : '无'}
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
