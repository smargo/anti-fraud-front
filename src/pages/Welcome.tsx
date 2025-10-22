import { getStaticSrc } from '@/utils';
import React from 'react';

const Welcome: React.FC = () => {
  return (
    <div
      style={{
        height: 'calc(100vh - 70px)',
        position: 'relative',
      }}
    >
      <img
        style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
        src={getStaticSrc('/images/home-bg.png')}
      />
      <div
        style={{
          position: 'absolute',
          top: '5%',
          right: 90,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img style={{ width: 50, height: 50 }} src={getStaticSrc('/images/logo500.jpg')} />
        <span
          style={{
            color: '#000',
            fontWeight: 'bold',
            fontSize: 18,
            marginLeft: 3,
            fontStyle: 'italic',
          }}
        >
          授信审批系统
        </span>
      </div>
      <div style={{ position: 'absolute', top: '30%', left: 146 }}>
        <div
          style={{ fontSize: 60, fontWeight: 'bold', fontStyle: 'italic', fontFamily: 'inherit' }}
        >
          <span style={{ marginRight: 60 }}>
            <span style={{ color: '#1538ea' }}>高效</span>审批
          </span>
          <span>
            <span style={{ color: '#1538ea' }}>敏捷</span>管理
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 20, letterSpacing: 8 }}>
          <span
            style={{
              display: 'inline-block',
              width: 210,
              height: 1,
              backgroundColor: '#9a9a9a',
              marginRight: 10,
            }}
          ></span>
          <span style={{ marginRight: 30, color: '#9a9a9a', fontSize: '12px' }}>欢迎使用</span>
          <span style={{ color: '#7480c2', fontSize: '24px' }}></span>
          <span
            style={{ display: 'inline-block', width: 210, height: 1, backgroundColor: '#9a9a9a' }}
          ></span>
        </div>
        <div
          style={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            right: -62,
            width: 50,
            height: 24,
            padding: '4px',
            color: '#fff',
            fontSize: 16,
            lineHeight: 1,
            borderRadius: '18px 0',
            backgroundColor: '#1538ea',
          }}
        >
          2.0
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: '8%', left: 64 }}>
        <img style={{ width: 120, height: 32 }} src="/images/bcsLogo.png" />
        <div style={{ letterSpacing: 4, marginTop: 15, color: '#333' }}>
          科技金融、普惠金融、信用生活
        </div>
      </div>
    </div>
  );
};

export default Welcome;
