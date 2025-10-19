/**
 * SystemDictViewModal 组件
 */

import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import moment from 'moment';
import { getDictText, type DictItem } from '@/utils/dictUtils';
import type { SystemDictItem } from '../types';

interface SystemDictViewModalProps {
  visible: boolean;
  viewingDict: SystemDictItem | undefined;
  enableOptions: DictItem[];
  onCancel: () => void;
}

const SystemDictViewModal: React.FC<SystemDictViewModalProps> = ({
  visible,
  viewingDict,
  enableOptions,
  onCancel,
}) => {
  return (
    <Modal
      title="字典详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      {viewingDict && (
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="字典ID" span={2}>
            <Tag color="blue">{viewingDict.id}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="代码编号">
            <Tag color="green">{viewingDict.codeNo}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="代码项编号">
            <Tag color="purple">{viewingDict.itemNo}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="代码项值">
            <Tag color="orange">{viewingDict.itemValue}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="其他映射代码">
            <Tag color="cyan">{viewingDict.otherNo || '无'}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="代码描述" span={2}>
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {viewingDict.itemDescribe || '无'}
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="排序编号">
            <Tag color="magenta">{viewingDict.sortNo || '无'}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="展示类别">
            <Tag color="lime">{viewingDict.listClass || '无'}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="状态">
            <Tag color={viewingDict.status === 'Y' ? 'green' : 'red'}>
              {getDictText(enableOptions, viewingDict.status || '')}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="创建时间">
            {viewingDict.createdDate
              ? moment(viewingDict.createdDate).format('YYYY-MM-DD HH:mm:ss')
              : '无'}
          </Descriptions.Item>

          <Descriptions.Item label="创建人">
            <Tag color="cyan">{viewingDict.createdBy || '未知'}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="最后修改时间">
            {viewingDict.lastModifiedDate
              ? moment(viewingDict.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss')
              : '无'}
          </Descriptions.Item>

          <Descriptions.Item label="最后修改人">
            <Tag color="magenta">{viewingDict.lastModifiedBy || '未知'}</Tag>
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default SystemDictViewModal;

