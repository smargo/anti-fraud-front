import { PageContainer } from '@ant-design/pro-components';
import { Spin } from 'antd';
import React from 'react';

const Loading: React.FC = () => {
  return (
    <PageContainer>
      <div style={{ paddingTop: 100, textAlign: 'center' }}>
        <Spin size="large"></Spin>
      </div>
    </PageContainer>
  );
};
export default Loading;
