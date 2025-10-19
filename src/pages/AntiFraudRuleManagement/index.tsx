import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Space, message } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { FormilyDrawerForm } from '../../components/Formily/FormilyForm';
import { useFormilyForm } from '../../hooks/useFormilyForm';
import {
  fieldConfigs,
  layoutConfigs,
  commonOptions,
  validators,
  formUtils,
} from '../../utils/formily';

// 反欺诈规则表单 Schema
const createRuleSchema = (isEdit = false) => {
  const ruleTypeOptions = [
    { label: '信用评分规则', value: 'credit_score' },
    { label: '行为分析规则', value: 'behavior_analysis' },
    { label: '设备指纹规则', value: 'device_fingerprint' },
    { label: '地理位置规则', value: 'location' },
    { label: '社交网络规则', value: 'social_network' },
  ];

  const properties = {
    ruleName: formUtils.createField(fieldConfigs.input('规则名称', '请输入规则名称', true), [
      validators.required(),
      validators.maxLength(64),
    ]),
    ruleCode: formUtils.createField(fieldConfigs.input('规则编码', '请输入规则编码', true), [
      validators.required(),
      validators.maxLength(32),
    ]),
    ruleType: formUtils.createField(
      fieldConfigs.select('规则类型', ruleTypeOptions, '请选择规则类型', true),
    ),
    riskLevel: formUtils.createField(
      fieldConfigs.select('风险等级', commonOptions.riskLevel, '请选择风险等级', true),
    ),
    threshold: formUtils.createField(fieldConfigs.number('阈值', '请输入阈值', true), [
      validators.required(),
    ]),
    enabled: fieldConfigs.switch('是否启用', true),
    description: formUtils.createSpanField(
      fieldConfigs.textArea('规则描述', '请输入规则描述', false, 3),
      2,
    ),
  };

  // 编辑模式下添加系统字段
  if (isEdit) {
    properties.createdBy = formUtils.createReadonlyField(
      fieldConfigs.input('创建人', '系统自动填充'),
    );
    properties.createdDate = formUtils.createReadonlyField(
      fieldConfigs.datePicker('创建时间', '系统自动填充', false, true),
    );
  }

  return layoutConfigs.twoColumns(properties);
};

// 模拟数据
const mockRules = [
  {
    id: '1',
    ruleName: '高风险设备检测',
    ruleCode: 'HIGH_RISK_DEVICE',
    ruleType: 'device_fingerprint',
    riskLevel: 'high',
    threshold: 85.5,
    enabled: true,
    description: '检测高风险设备指纹，包括模拟器、虚拟机等',
    createdBy: 'admin',
    createdDate: '2024-01-15 10:30:00',
  },
  {
    id: '2',
    ruleName: '异常登录行为',
    ruleCode: 'ABNORMAL_LOGIN',
    ruleType: 'behavior_analysis',
    riskLevel: 'medium',
    threshold: 70.0,
    enabled: true,
    description: '检测异常登录行为，如频繁登录、异地登录等',
    createdBy: 'admin',
    createdDate: '2024-01-16 14:20:00',
  },
];

const AntiFraudRuleManagement: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAddRule = () => {
    setEditingRule(null);
    setDrawerOpen(true);
  };

  const handleEditRule = (rule: any) => {
    setEditingRule(rule);
    setDrawerOpen(true);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 模拟 API 调用
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1000);
      });

      if (editingRule) {
        message.success('规则更新成功');
      } else {
        message.success('规则创建成功');
      }

      setDrawerOpen(false);
      // 这里可以刷新列表数据
    } catch (error) {
      message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDrawerOpen(false);
    setEditingRule(null);
  };

  return (
    <PageContainer
      title="反欺诈规则管理"
      subTitle="管理和配置反欺诈检测规则"
      extra={
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRule}>
            新增规则
          </Button>
        </Space>
      }
    >
      <div style={{ padding: 24 }}>
        <h3>规则列表</h3>
        <div style={{ marginBottom: 16 }}>
          {mockRules.map((rule) => (
            <div
              key={rule.id}
              style={{
                padding: 16,
                border: '1px solid #d9d9d9',
                borderRadius: 6,
                marginBottom: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h4 style={{ margin: 0 }}>{rule.ruleName}</h4>
                <p style={{ margin: '8px 0 0 0', color: '#666' }}>{rule.description}</p>
                <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                  <span>规则编码: {rule.ruleCode}</span>
                  <span style={{ marginLeft: 16 }}>风险等级: {rule.riskLevel}</span>
                  <span style={{ marginLeft: 16 }}>阈值: {rule.threshold}</span>
                  <span style={{ marginLeft: 16 }}>状态: {rule.enabled ? '启用' : '禁用'}</span>
                </div>
              </div>
              <Button type="link" icon={<EditOutlined />} onClick={() => handleEditRule(rule)}>
                编辑
              </Button>
            </div>
          ))}
        </div>

        <FormilyDrawerForm
          open={drawerOpen}
          title={editingRule ? '编辑反欺诈规则' : '新增反欺诈规则'}
          schema={createRuleSchema(!!editingRule)}
          initialValues={editingRule || {}}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          width={800}
          className="anti-fraud-rule-form"
        />
      </div>
    </PageContainer>
  );
};

export default AntiFraudRuleManagement;
