import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Button, Space, message, Alert, Descriptions, Tag } from 'antd';
import {
  ApiOutlined,
  SendOutlined,
  MessageOutlined,
  SettingOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import {
  isMicroApp,
  getMicroAppName,
  getMicroAppPublicPath,
  getMasterAppProps,
  microAppRouter,
  microAppState,
  microAppCommunication,
  microAppLifecycle,
} from '../../utils/microApp';

const MicroAppDemo: React.FC = () => {
  const [microAppInfo, setMicroAppInfo] = useState<any>({});
  const [masterProps, setMasterProps] = useState<any>({});
  const [communicationData, setCommunicationData] = useState<any>({});
  const [stateData, setStateData] = useState<any>({});

  useEffect(() => {
    // 初始化微前端信息
    setMicroAppInfo({
      isMicroApp: isMicroApp(),
      appName: getMicroAppName(),
      publicPath: getMicroAppPublicPath(),
    });

    // 获取主应用传递的属性
    setMasterProps(getMasterAppProps());

    // 获取微前端状态
    setStateData({
      currentPath: microAppRouter.getCurrentMicroAppPath(),
      isInAntiFraud: microAppRouter.isInMicroApp('anti-fraud-frontend'),
    });

    // 监听主应用消息
    const cleanup = microAppCommunication.on('masterMessage', (data) => {
      setCommunicationData((prev) => ({
        ...prev,
        lastMessage: data,
        messageCount: (prev.messageCount || 0) + 1,
      }));
    });

    // 微前端生命周期
    microAppLifecycle.onMount(() => {
      console.log('微前端应用已挂载');
      message.success('微前端应用已挂载');
    });

    microAppLifecycle.onUnmount(() => {
      console.log('微前端应用即将卸载');
    });

    return cleanup;
  }, []);

  // 发送消息到主应用
  const handleSendMessage = () => {
    const messageData = {
      timestamp: new Date().toISOString(),
      content: 'Hello from Anti-Fraud Frontend!',
      data: { userId: '123', action: 'test' },
    };

    microAppCommunication.emit('microAppMessage', messageData);
    message.success('消息已发送到主应用');
  };

  // 请求主应用数据
  const handleRequestData = async () => {
    try {
      const data = await microAppCommunication.request('getUserInfo', {
        userId: '123',
      });
      setCommunicationData((prev) => ({
        ...prev,
        lastResponse: data,
        responseCount: (prev.responseCount || 0) + 1,
      }));
      message.success('数据请求成功');
    } catch (error) {
      message.error(`数据请求失败: ${error.message}`);
    }
  };

  // 设置微前端状态
  const handleSetState = () => {
    const stateValue = {
      timestamp: new Date().toISOString(),
      value: Math.random().toString(36).substr(2, 9),
    };

    microAppState.setState('demoState', stateValue);
    setStateData((prev) => ({
      ...prev,
      demoState: stateValue,
    }));
    message.success('状态已设置');
  };

  // 清除微前端状态
  const handleClearState = () => {
    microAppState.clearState('demoState');
    setStateData((prev) => ({
      ...prev,
      demoState: null,
    }));
    message.success('状态已清除');
  };

  // 跳转到其他微前端应用
  const handleNavigateToCas = () => {
    microAppRouter.navigateToMicroApp('cas-front', '/dashboard');
    message.info('正在跳转到 CAS 应用...');
  };

  return (
    <PageContainer
      title="微前端功能演示"
      subTitle="展示 qiankun 微前端框架的各种功能"
      extra={
        <Space>
          <Button icon={<SendOutlined />} onClick={handleSendMessage} type="primary">
            发送消息
          </Button>
          <Button icon={<ApiOutlined />} onClick={handleRequestData}>
            请求数据
          </Button>
        </Space>
      }
    >
      {/* 微前端环境信息 */}
      <Card title="微前端环境信息" style={{ marginBottom: 16 }}>
        <Descriptions column={2}>
          <Descriptions.Item label="是否在微前端环境">
            <Tag color={microAppInfo.isMicroApp ? 'green' : 'red'}>
              {microAppInfo.isMicroApp ? '是' : '否'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="应用名称">
            {microAppInfo.appName || '独立运行'}
          </Descriptions.Item>
          <Descriptions.Item label="公共路径">{microAppInfo.publicPath || '无'}</Descriptions.Item>
          <Descriptions.Item label="当前路径">{stateData.currentPath || '/'}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 主应用传递的属性 */}
      <Card title="主应用传递的属性" style={{ marginBottom: 16 }}>
        {Object.keys(masterProps).length > 0 ? (
          <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
            {JSON.stringify(masterProps, null, 2)}
          </pre>
        ) : (
          <Alert
            message="未接收到主应用传递的属性"
            description="当前应用可能独立运行，或者主应用未传递任何属性"
            type="info"
            icon={<InfoCircleOutlined />}
          />
        )}
      </Card>

      {/* 微前端通信 */}
      <Card
        title="微前端通信"
        extra={
          <Space>
            <Button icon={<MessageOutlined />} onClick={handleSendMessage} size="small">
              发送消息
            </Button>
            <Button icon={<ApiOutlined />} onClick={handleRequestData} size="small">
              请求数据
            </Button>
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <Descriptions column={2}>
          <Descriptions.Item label="消息计数">
            {communicationData.messageCount || 0}
          </Descriptions.Item>
          <Descriptions.Item label="响应计数">
            {communicationData.responseCount || 0}
          </Descriptions.Item>
        </Descriptions>

        {communicationData.lastMessage && (
          <Alert
            message="最新接收的消息"
            description={
              <pre style={{ margin: 0, fontSize: 12 }}>
                {JSON.stringify(communicationData.lastMessage, null, 2)}
              </pre>
            }
            type="success"
            style={{ marginTop: 16 }}
          />
        )}

        {communicationData.lastResponse && (
          <Alert
            message="最新响应数据"
            description={
              <pre style={{ margin: 0, fontSize: 12 }}>
                {JSON.stringify(communicationData.lastResponse, null, 2)}
              </pre>
            }
            type="info"
            style={{ marginTop: 16 }}
          />
        )}
      </Card>

      {/* 微前端状态管理 */}
      <Card
        title="微前端状态管理"
        extra={
          <Space>
            <Button icon={<SettingOutlined />} onClick={handleSetState} size="small">
              设置状态
            </Button>
            <Button onClick={handleClearState} size="small">
              清除状态
            </Button>
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        {stateData.demoState ? (
          <Alert
            message="当前状态"
            description={
              <pre style={{ margin: 0, fontSize: 12 }}>
                {JSON.stringify(stateData.demoState, null, 2)}
              </pre>
            }
            type="success"
          />
        ) : (
          <Alert
            message="暂无状态数据"
            description="点击'设置状态'按钮来设置一些状态数据"
            type="info"
          />
        )}
      </Card>

      {/* 微前端路由 */}
      <Card title="微前端路由" style={{ marginBottom: 16 }}>
        <Space>
          <Button onClick={handleNavigateToCas} type="primary">
            跳转到 CAS 应用
          </Button>
          <Button
            onClick={() => {
              microAppRouter.navigateToMicroApp('anti-fraud-frontend', '/dashboard');
              message.info('正在跳转到仪表盘...');
            }}
          >
            跳转到仪表盘
          </Button>
        </Space>

        <Alert
          message="路由信息"
          description={
            <div>
              <p>当前路径: {stateData.currentPath}</p>
              <p>是否在反欺诈应用中: {stateData.isInAntiFraud ? '是' : '否'}</p>
            </div>
          }
          type="info"
          style={{ marginTop: 16 }}
        />
      </Card>

      {/* 微前端生命周期 */}
      <Card title="微前端生命周期">
        <Alert
          message="生命周期事件"
          description="微前端应用的生命周期事件会在控制台中输出，包括挂载、卸载等事件"
          type="info"
        />

        <div style={{ marginTop: 16 }}>
          <Button
            onClick={() => {
              microAppLifecycle.onMount(() => {
                message.success('生命周期回调已注册');
              });
            }}
          >
            注册挂载回调
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
};

export default MicroAppDemo;
