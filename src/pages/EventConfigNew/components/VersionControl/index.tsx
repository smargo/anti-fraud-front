/**
 * 版本控制组件
 */

import React from 'react';
import { Button, Space, Tag, Tooltip } from 'antd';
import { 
  HistoryOutlined, 
  SendOutlined, 
  FileTextOutlined,
  ArrowLeftOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'umi';
import { hasDraftVersion } from '../utils';
import type { 
  EventConfigVersion, 
  EventConfigVersionInfo,
  VersionControlProps 
} from '../types';

const VersionControl: React.FC<VersionControlProps> = ({
  eventNo,
  currentVersion,
  isDraftMode,
  isReadOnly,
  versionInfo,
  onCreateDraft,
  onShowVersionHistory,
  onShowCreateVersionModal,
}) => {
  const navigate = useNavigate();

  // 返回事件列表
  const handleBack = () => {
    navigate('/event-list');
  };

  return (
    <div style={{ marginBottom: 16, padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* 左侧：版本信息 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {currentVersion && (
            <>
              <div>
                <span style={{ marginRight: 8 }}>当前版本：</span>
                <Tag color={isDraftMode ? 'orange' : isReadOnly ? 'blue' : 'green'}>
                  {currentVersion.versionCode}
                </Tag>
              </div>
              <div>
                <span style={{ marginRight: 8 }}>状态：</span>
                <Tag color={isDraftMode ? 'orange' : isReadOnly ? 'blue' : 'green'}>
                  {isDraftMode ? '草稿' : isReadOnly ? '只读' : '编辑'}
                </Tag>
              </div>
              {versionInfo.hasUnsavedChanges && (
                <Tag color="red">有未保存的更改</Tag>
              )}
            </>
          )}
        </div>

        {/* 右侧：操作按钮 */}
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            返回事件列表
          </Button>
          
          <Button 
            icon={<HistoryOutlined />} 
            onClick={onShowVersionHistory}
          >
            版本历史
          </Button>
          
          {!hasDraftVersion(versionInfo.versionHistory) && (
            <Button 
              type="primary"
              icon={<FileTextOutlined />} 
              onClick={onCreateDraft}
            >
              创建草稿
            </Button>
          )}
          
          <Button 
            icon={<SendOutlined />} 
            onClick={onShowCreateVersionModal}
          >
            创建版本
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default VersionControl;
