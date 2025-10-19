/**
 * VersionControl 组件
 */

import React from 'react';
import { Card, Button, Space, Select, Tag } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import { getDictText } from '@/utils/dictUtils';
import { generateVersionOptions } from '../helper';
import type { EventConfigVersion, EventConfigVersionInfo } from '../types';

interface VersionControlProps {
  versionInfo: EventConfigVersionInfo;
  currentVersion: EventConfigVersion | null;
  versionStatusOptions: any[];
  isDraftMode: boolean;
  isReadOnly: boolean;
  onCreateVersion: () => void;
  onActivateVersion: (versionId: number) => void;
  onShowVersionHistory: () => void;
  onVersionSelect: (versionId: number) => void;
  hasDraftVersion: () => boolean;
}

const VersionControl: React.FC<VersionControlProps> = ({
  versionInfo,
  currentVersion,
  versionStatusOptions,
  isDraftMode,
  isReadOnly,
  onCreateVersion,
  onActivateVersion,
  onShowVersionHistory,
  onVersionSelect,
  hasDraftVersion,
}) => {
  const versionOptions = generateVersionOptions(versionInfo.versionHistory, versionStatusOptions);

  return (
    <Card style={{ marginBottom: 16 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <div>
          <h3>版本控制</h3>
          {currentVersion && (
            <div style={{ marginTop: 8 }}>
              <Space>
                <span>
                  当前版本: <strong>{currentVersion.versionCode}</strong>
                </span>
                <span>
                  状态:{' '}
                  <strong>{getDictText(versionStatusOptions, currentVersion.status)}</strong>
                </span>
                <span>描述: {currentVersion.versionDesc || '无'}</span>
                <span>版本id: {currentVersion.id}</span>
              </Space>
            </div>
          )}
        </div>
        <Space>
          <Button
            type="primary"
            onClick={onCreateVersion}
            disabled={isDraftMode || hasDraftVersion()}
          >
            创建新版本
          </Button>
          <Button
            type="primary"
            onClick={() => onActivateVersion(currentVersion?.id || 0)}
            disabled={!isDraftMode || isReadOnly || !currentVersion}
          >
            激活版本
          </Button>
          <Button icon={<HistoryOutlined />} onClick={onShowVersionHistory}>
            版本历史
          </Button>
        </Space>
      </div>

      {/* 版本选择器 */}
      {versionInfo.versionHistory.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Select
            style={{ width: 400 }}
            placeholder="选择要编辑的版本"
            value={currentVersion?.id}
            onChange={onVersionSelect}
            optionLabelProp="label"
          >
            {versionOptions.map((option) => (
              <Select.Option
                key={option.key}
                value={option.value}
                label={option.label}
                title={option.title}
              >
                <div
                  style={{
                    maxWidth: '350px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <strong>{option.version.versionCode}</strong> - {option.label.split(' - ')[1]}{' '}
                  <span style={{ color: '#999' }}>
                    ({getDictText(versionStatusOptions, option.version.status)})
                  </span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </div>
      )}
    </Card>
  );
};

export default VersionControl;

