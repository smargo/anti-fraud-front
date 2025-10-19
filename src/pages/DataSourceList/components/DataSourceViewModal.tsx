/**
 * DataSourceViewModal 组件
 */

import React, { useState } from 'react';
import { Modal, Descriptions, Tag, Button } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getDictText, type DictItem } from '@/utils/dictUtils';
import type { DataSourceItem } from '../types';

interface DataSourceViewModalProps {
  visible: boolean;
  viewingDataSource: DataSourceItem | null;
  dataSourceTypeOptions: DictItem[];
  onCancel: () => void;
}

const DataSourceViewModal: React.FC<DataSourceViewModalProps> = ({
  visible,
  viewingDataSource,
  dataSourceTypeOptions,
  onCancel,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Modal
      title="数据源详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      {viewingDataSource && (
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="数据源ID" span={2}>
            {viewingDataSource.id}
          </Descriptions.Item>

          <Descriptions.Item label="数据源编号">
            <Tag color="green">{viewingDataSource.dataSourceNo}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="数据源名称">
            <Tag color="purple">{viewingDataSource.dataSourceName}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="数据源类型">
            <Tag color="orange">
              {getDictText(dataSourceTypeOptions, viewingDataSource.dataSourceType)}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="用户名">
            <Tag color="cyan">{viewingDataSource.dataSourceUserName || '无'}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="连接字符串" span={2}>
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'monospace',
                fontSize: '12px',
              }}
            >
              {viewingDataSource.dataSourceConnectString || '无'}
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="密码" span={2}>
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#fff7e6',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>
                {viewingDataSource.dataSourcePassword
                  ? showPassword
                    ? viewingDataSource.dataSourcePassword
                    : '••••••••'
                  : '无'}
              </span>
              {viewingDataSource.dataSourcePassword && (
                <Button
                  type="text"
                  size="small"
                  icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    padding: '0 4px',
                    height: '20px',
                    minWidth: '20px',
                  }}
                />
              )}
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="数据源参数" span={2}>
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'monospace',
                fontSize: '12px',
              }}
            >
              {viewingDataSource.dataSourceParam || '无'}
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="创建时间">
            {moment(viewingDataSource.createdDate).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>

          <Descriptions.Item label="最后修改时间">
            {viewingDataSource.lastModifiedDate
              ? moment(viewingDataSource.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss')
              : '无'}
          </Descriptions.Item>

          <Descriptions.Item label="创建人">
            {viewingDataSource.createdBy || '无'}
          </Descriptions.Item>

          <Descriptions.Item label="最后修改人">
            {viewingDataSource.lastModifiedBy || '无'}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default DataSourceViewModal;

