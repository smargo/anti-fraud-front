import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Button, Space, Input, Select, message, Divider, Typography, Row, Col } from 'antd';
import {
  LockOutlined,
  FormOutlined,
  CheckCircleOutlined,
  ToolOutlined,
  CopyOutlined,
  DownloadOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import {
  CryptoUtils,
  FormatUtils,
  ValidateUtils,
  CommonUtils,
  MessageUtils,
  REG_EXP,
  FILE_TYPES,
  DATE_FORMATS,
} from '../../utils';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const UtilsDemo: React.FC = () => {
  const [cryptoInput, setCryptoInput] = useState('Hello World');
  const [cryptoResult, setCryptoResult] = useState('');
  const [formatInput, setFormatInput] = useState('');
  const [validateInput, setValidateInput] = useState('');
  const [validateResult, setValidateResult] = useState<any>({});

  // 加密工具演示
  const handleEncrypt = () => {
    const encrypted = CryptoUtils.aesEncrypt(cryptoInput);
    setCryptoResult(encrypted);
    MessageUtils.success('加密成功');
  };

  const handleDecrypt = () => {
    const decrypted = CryptoUtils.aesDecrypt(cryptoResult);
    MessageUtils.success(`解密结果: ${decrypted}`);
  };

  const handleMD5 = () => {
    const hash = CryptoUtils.md5(cryptoInput);
    setCryptoResult(hash);
    MessageUtils.success('MD5 计算完成');
  };

  const handleBase64 = () => {
    const encoded = CryptoUtils.base64Encode(cryptoInput);
    setCryptoResult(encoded);
    MessageUtils.success('Base64 编码完成');
  };

  // 格式化工具演示
  const handleFormatDate = () => {
    const formatted = FormatUtils.formatDateTime(new Date());
    MessageUtils.success(`当前时间: ${formatted}`);
  };

  const handleFormatCurrency = () => {
    const formatted = FormatUtils.formatCurrency(1234567.89);
    MessageUtils.success(`格式化金额: ${formatted}`);
  };

  const handleFormatPhone = () => {
    const formatted = FormatUtils.formatPhone('13812345678');
    MessageUtils.success(`格式化手机号: ${formatted}`);
  };

  const handleFormatFileSize = () => {
    const formatted = FormatUtils.formatFileSize(1024 * 1024 * 5);
    MessageUtils.success(`格式化文件大小: ${formatted}`);
  };

  // 验证工具演示
  const handleValidate = () => {
    const results = {
      isEmpty: ValidateUtils.isEmpty(validateInput),
      isEmail: ValidateUtils.isEmail(validateInput),
      isPhone: ValidateUtils.isPhone(validateInput),
      isNumber: ValidateUtils.isNumber(validateInput),
      containsChinese: ValidateUtils.containsChinese(validateInput),
      validateLength: ValidateUtils.validateLength(validateInput, 1, 100),
    };
    setValidateResult(results);
    MessageUtils.success('验证完成');
  };

  // 通用工具演示
  const handleCopy = () => {
    CommonUtils.copyToClipboard('这是复制的内容');
  };

  const handleGenerateId = () => {
    const id = CryptoUtils.generateUniqueId();
    MessageUtils.success(`生成唯一ID: ${id}`);
  };

  const handleFilterNull = () => {
    const data = { name: 'test', age: '', city: 'beijing', phone: null };
    const filtered = CommonUtils.filterNullField(data);
    MessageUtils.success(`过滤结果: ${JSON.stringify(filtered)}`);
  };

  return (
    <PageContainer
      title="工具函数库演示"
      subTitle="展示各种工具函数的使用方法和效果"
      extra={
        <Space>
          <Button icon={<ToolOutlined />} onClick={() => MessageUtils.info('工具函数库演示页面')}>
            帮助
          </Button>
        </Space>
      }
    >
      <Row gutter={[16, 16]}>
        {/* 加密工具 */}
        <Col span={12}>
          <Card title="加密工具" icon={<LockOutlined />}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>输入内容:</Text>
                <Input
                  value={cryptoInput}
                  onChange={(e) => setCryptoInput(e.target.value)}
                  placeholder="请输入要加密的内容"
                />
              </div>
              <div>
                <Text strong>加密结果:</Text>
                <TextArea
                  value={cryptoResult}
                  readOnly
                  rows={3}
                  placeholder="加密结果将显示在这里"
                />
              </div>
              <Space wrap>
                <Button onClick={handleEncrypt}>AES 加密</Button>
                <Button onClick={handleDecrypt}>AES 解密</Button>
                <Button onClick={handleMD5}>MD5 哈希</Button>
                <Button onClick={handleBase64}>Base64 编码</Button>
              </Space>
              <Divider />
              <div>
                <Text strong>其他功能:</Text>
                <Space wrap>
                  <Button onClick={handleGenerateId}>生成唯一ID</Button>
                  <Button
                    onClick={() =>
                      MessageUtils.success(`随机字符串: ${CryptoUtils.generateRandomString(8)}`)
                    }
                  >
                    生成随机字符串
                  </Button>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>

        {/* 格式化工具 */}
        <Col span={12}>
          <Card title="格式化工具" icon={<FormOutlined />}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>日期时间格式化:</Text>
                <Button onClick={handleFormatDate}>格式化当前时间</Button>
                <Text code>
                  {FormatUtils.formatDateTime(new Date(), 'YYYY年MM月DD日 HH:mm:ss')}
                </Text>
              </div>
              <Divider />
              <div>
                <Text strong>金额格式化:</Text>
                <Button onClick={handleFormatCurrency}>格式化金额</Button>
                <Text code>{FormatUtils.formatCurrency(1234567.89)}</Text>
              </div>
              <Divider />
              <div>
                <Text strong>手机号格式化:</Text>
                <Button onClick={handleFormatPhone}>格式化手机号</Button>
                <Text code>{FormatUtils.formatPhone('13812345678')}</Text>
              </div>
              <Divider />
              <div>
                <Text strong>文件大小格式化:</Text>
                <Button onClick={handleFormatFileSize}>格式化文件大小</Button>
                <Text code>{FormatUtils.formatFileSize(1024 * 1024 * 5)}</Text>
              </div>
              <Divider />
              <div>
                <Text strong>其他格式化:</Text>
                <Space wrap>
                  <Button
                    onClick={() => MessageUtils.success(`比例: ${FormatUtils.formatRate(0.1234)}`)}
                  >
                    格式化比例
                  </Button>
                  <Button
                    onClick={() =>
                      MessageUtils.success(
                        `相对时间: ${FormatUtils.formatRelativeTime(new Date(Date.now() - 3600000))}`,
                      )
                    }
                  >
                    相对时间
                  </Button>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>

        {/* 验证工具 */}
        <Col span={12}>
          <Card title="验证工具" icon={<CheckCircleOutlined />}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>输入内容:</Text>
                <Input
                  value={validateInput}
                  onChange={(e) => setValidateInput(e.target.value)}
                  placeholder="请输入要验证的内容"
                />
              </div>
              <Button onClick={handleValidate}>开始验证</Button>
              <Divider />
              <div>
                <Text strong>验证结果:</Text>
                <div style={{ background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
                  <pre>{JSON.stringify(validateResult, null, 2)}</pre>
                </div>
              </div>
              <Divider />
              <div>
                <Text strong>常用验证:</Text>
                <Space wrap>
                  <Button
                    onClick={() =>
                      MessageUtils.success(`邮箱验证: ${ValidateUtils.isEmail('test@example.com')}`)
                    }
                  >
                    验证邮箱
                  </Button>
                  <Button
                    onClick={() =>
                      MessageUtils.success(`手机号验证: ${ValidateUtils.isPhone('13812345678')}`)
                    }
                  >
                    验证手机号
                  </Button>
                  <Button
                    onClick={() =>
                      MessageUtils.success(
                        `身份证验证: ${ValidateUtils.isIdCard('110101199001011234')}`,
                      )
                    }
                  >
                    验证身份证
                  </Button>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>

        {/* 通用工具 */}
        <Col span={12}>
          <Card title="通用工具" icon={<ToolOutlined />}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>剪贴板操作:</Text>
                <Button icon={<CopyOutlined />} onClick={handleCopy}>
                  复制到剪贴板
                </Button>
              </div>
              <Divider />
              <div>
                <Text strong>数据处理:</Text>
                <Button onClick={handleFilterNull}>过滤空字段</Button>
              </div>
              <Divider />
              <div>
                <Text strong>数学运算:</Text>
                <Button
                  onClick={() =>
                    MessageUtils.success(`加法结果: ${CommonUtils.addNumbers(1, 2, 3, 4, 5)}`)
                  }
                >
                  数字求和
                </Button>
              </div>
              <Divider />
              <div>
                <Text strong>环境检测:</Text>
                <Space wrap>
                  <Button onClick={() => MessageUtils.info(`开发环境: ${CommonUtils.isDev}`)}>
                    检测开发环境
                  </Button>
                  <Button
                    onClick={() =>
                      MessageUtils.info(`本地开发: ${CommonUtils.isLocalDevelopment()}`)
                    }
                  >
                    检测本地开发
                  </Button>
                </Space>
              </div>
              <Divider />
              <div>
                <Text strong>其他功能:</Text>
                <Space wrap>
                  <Button
                    onClick={() => MessageUtils.success(`UUID: ${CryptoUtils.generateUUID()}`)}
                  >
                    生成UUID
                  </Button>
                  <Button
                    onClick={() =>
                      MessageUtils.success(`时间差: ${FormatUtils.formatTimeDiff(3661)}`)
                    }
                  >
                    时间差格式化
                  </Button>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>

        {/* 常量演示 */}
        <Col span={24}>
          <Card title="常量演示">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div>
                  <Title level={5}>正则表达式</Title>
                  <Space direction="vertical">
                    <Text code>手机号: {REG_EXP.PHONE.source}</Text>
                    <Text code>邮箱: {REG_EXP.EMAIL.source}</Text>
                    <Text code>身份证: {REG_EXP.IDNBR.source}</Text>
                  </Space>
                </div>
              </Col>
              <Col span={8}>
                <div>
                  <Title level={5}>文件类型</Title>
                  <Space direction="vertical">
                    <Text>图片: {FILE_TYPES.IMAGE.join(', ')}</Text>
                    <Text>文档: {FILE_TYPES.DOCUMENT.join(', ')}</Text>
                    <Text>文本: {FILE_TYPES.TEXT.join(', ')}</Text>
                  </Space>
                </div>
              </Col>
              <Col span={8}>
                <div>
                  <Title level={5}>日期格式</Title>
                  <Space direction="vertical">
                    <Text code>日期: {DATE_FORMATS.DATE}</Text>
                    <Text code>时间: {DATE_FORMATS.TIME}</Text>
                    <Text code>日期时间: {DATE_FORMATS.DATETIME}</Text>
                  </Space>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 使用说明 */}
        <Col span={24}>
          <Card title="使用说明">
            <Paragraph>
              <Text strong>工具函数库包含以下模块：</Text>
            </Paragraph>
            <ul>
              <li>
                <Text strong>加密工具 (CryptoUtils):</Text> 提供 AES 加密、MD5 哈希、Base64
                编码等功能
              </li>
              <li>
                <Text strong>格式化工具 (FormatUtils):</Text>{' '}
                提供日期、金额、手机号、文件大小等格式化功能
              </li>
              <li>
                <Text strong>验证工具 (ValidateUtils):</Text>{' '}
                提供各种数据验证功能，如邮箱、手机号、身份证等
              </li>
              <li>
                <Text strong>通用工具 (CommonUtils):</Text>{' '}
                提供文件下载、剪贴板操作、数据处理等通用功能
              </li>
              <li>
                <Text strong>消息工具 (MessageUtils):</Text> 提供统一的消息显示功能
              </li>
              <li>
                <Text strong>常量定义:</Text> 统一维护项目中的各种常量
              </li>
            </ul>
            <Paragraph>
              <Text strong>导入方式：</Text>
            </Paragraph>
            <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
              {`// 按需导入
import { CryptoUtils, FormatUtils, ValidateUtils } from '@/utils';

// 全部导入
import * as Utils from '@/utils';

// 默认导入
import Utils from '@/utils';`}
            </pre>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default UtilsDemo;

