import React from 'react';
import { Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { AvatarDropdown } from './AvatarDropdown';

export type SiderTheme = 'light' | 'dark';

export const Question = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        window.open('https://pro.ant.design/docs/getting-started');
      }}
    >
      <QuestionCircleOutlined />
    </div>
  );
};

export const GlobalHeaderRight: React.FC = () => {
  const actionClassName = 'ant-pro-global-header-action';

  return (
    <Space>
      <Question />
      <AvatarDropdown />
    </Space>
  );
};

export default GlobalHeaderRight;
