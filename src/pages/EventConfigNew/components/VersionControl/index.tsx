/**
 * 版本控制组件 - 完全按照原页面逻辑实现
 */

import { HistoryOutlined, PlusOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Modal, Select, Space, message } from 'antd';
import React from 'react';
import type { VersionControlProps } from '../../types';

const VersionControl: React.FC<VersionControlProps> = ({
  eventNo,
  currentVersion,
  isDraftMode,
  isReadOnly,
  versionInfo,
  onShowVersionHistory,
  onShowCreateVersionModal,
  onSelectVersion,
  onActivateVersion,
}) => {
  // 激活版本
  const handleActivateVersion = async (versionId: string) => {
    const versionToActivate = versionInfo.versionHistory.find((v) => v.id === versionId);
    if (!versionToActivate) return;

    Modal.confirm({
      title: '确认激活',
      content: `确定要激活版本 ${versionToActivate.versionCode} 吗？这将激活该版本并且把当前生效版本置为归档。`,
      okText: '确认激活',
      cancelText: '取消',
      okType: 'primary',
      onOk: async () => {
        try {
          await onActivateVersion(versionId);
        } catch (error: any) {
          message.error(error?.message || '激活版本失败');
        }
      },
    });
  };

  // 检查是否存在草稿版本
  const hasDraftVersion = () => {
    return versionInfo.versionHistory.some((v) => v.status === 'DRAFT');
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {/* 版本控制卡片 */}
      <div
        style={{
          background: '#fff',
          padding: '16px',
          borderRadius: '6px',
          marginBottom: '16px',
          border: '1px solid #d9d9d9',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>版本控制</h3>
            {currentVersion && (
              <div style={{ marginTop: 8 }}>
                <Space>
                  <span>
                    当前版本: <strong>{currentVersion.versionCode}</strong>
                  </span>
                  <span>
                    状态:{' '}
                    <strong>
                      {currentVersion.status === 'DRAFT'
                        ? '草稿'
                        : currentVersion.status === 'ACTIVE'
                        ? '生效'
                        : currentVersion.status === 'APPROVED'
                        ? '已审批'
                        : '已归档'}
                    </strong>
                  </span>
                  <span>描述: {currentVersion.versionDesc || '无描述'}</span>
                  <span>版本id: {currentVersion.id}</span>
                  {isReadOnly && <span style={{ color: '#ff4d4f' }}>(只读)</span>}
                </Space>
              </div>
            )}
          </div>
          <Space>
            <Button
              type="primary"
              onClick={onShowCreateVersionModal}
              disabled={isDraftMode || hasDraftVersion()}
              icon={<PlusOutlined />}
            >
              创建新版本
            </Button>
            <Button
              type="primary"
              onClick={() => handleActivateVersion(currentVersion?.id || '')}
              disabled={!isDraftMode || isReadOnly || !currentVersion}
              icon={<SendOutlined />}
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
          <div style={{ marginBottom: 16 }}>
            <span style={{ marginRight: 8 }}>选择版本:</span>
            <Select
              value={currentVersion?.id}
              onChange={(val) => onSelectVersion(val)}
              style={{ width: 400 }}
              placeholder="请选择版本"
              optionLabelProp="label"
            >
              {versionInfo.versionHistory.map((version) => {
                const shortDesc =
                  version.versionDesc && version.versionDesc.length > 20
                    ? version.versionDesc.substring(0, 20) + '...'
                    : version.versionDesc || '无描述';
                const statusText =
                  version.status === 'DRAFT'
                    ? '草稿'
                    : version.status === 'ACTIVE'
                    ? '生效'
                    : version.status === 'APPROVED'
                    ? '已审批'
                    : '已归档';
                const fullText = `${version.versionCode} - ${
                  version.eventDesc || '无描述'
                } (${statusText})`;

                return (
                  <Select.Option
                    key={version.id}
                    value={version.id}
                    label={`${version.versionCode} - ${shortDesc} (${statusText})`}
                    title={fullText}
                  >
                    <div
                      style={{
                        maxWidth: '350px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <strong>{version.versionCode}</strong> - {shortDesc}{' '}
                      <span style={{ color: '#999' }}>({statusText})</span>
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default VersionControl;
