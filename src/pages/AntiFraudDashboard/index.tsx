import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Card, Statistic, Select, DatePicker, Space, Button } from 'antd';
import {
  SecurityScanOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { EChartsCard } from '../../components/ECharts/EChartsCard';
import {
  generateBarChartOption,
  generateLineChartOption,
  generatePieChartOption,
  generateFunnelChartOption,
  generateGaugeChartOption,
  generateRadarChartOption,
  chartColors,
} from '../../utils/echarts';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 模拟数据
const mockData = {
  // 风险趋势数据
  riskTrend: {
    categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    series: [
      {
        name: '高风险',
        data: [12, 8, 15, 22, 18, 25],
        color: chartColors.error,
      },
      {
        name: '中风险',
        data: [35, 28, 42, 38, 45, 52],
        color: chartColors.warning,
      },
      {
        name: '低风险',
        data: [120, 95, 110, 125, 130, 140],
        color: chartColors.success,
      },
    ],
  },

  // 欺诈类型分布
  fraudTypes: [
    { name: '设备指纹异常', value: 45, color: chartColors.error },
    { name: '行为模式异常', value: 32, color: chartColors.warning },
    { name: '地理位置异常', value: 28, color: chartColors.info },
    { name: '社交网络异常', value: 15, color: chartColors.purple },
    { name: '其他', value: 8, color: chartColors.gray },
  ],

  // 处理流程漏斗
  processFunnel: [
    { name: '总申请数', value: 1000 },
    { name: '初步筛选', value: 850 },
    { name: '风险评估', value: 720 },
    { name: '人工审核', value: 650 },
    { name: '最终通过', value: 580 },
  ],

  // 规则命中率
  ruleHitRate: {
    categories: ['设备检测', '行为分析', '地理位置', '社交网络', '信用评分'],
    series: [
      {
        name: '命中率',
        data: [85, 72, 68, 45, 78],
        color: chartColors.primary,
      },
    ],
  },

  // 风险评分分布
  riskScoreDistribution: {
    categories: ['0-20', '21-40', '41-60', '61-80', '81-100'],
    series: [
      {
        name: '用户数量',
        data: [120, 85, 65, 45, 25],
        color: chartColors.primary,
      },
    ],
  },

  // 风险雷达图
  riskRadar: {
    indicators: [
      { name: '设备风险', max: 100 },
      { name: '行为风险', max: 100 },
      { name: '位置风险', max: 100 },
      { name: '社交风险', max: 100 },
      { name: '信用风险', max: 100 },
    ],
    series: [
      {
        name: '平均风险',
        data: [75, 68, 82, 45, 70],
        color: chartColors.warning,
      },
      {
        name: '高风险用户',
        data: [95, 88, 92, 85, 90],
        color: chartColors.error,
      },
    ],
  },
};

const AntiFraudDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('today');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(1, 'day'),
    dayjs(),
  ]);

  // 模拟数据加载
  const loadData = async () => {
    setLoading(true);
    // 模拟 API 调用
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1000);
    });
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [timeRange, dateRange]);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    // 根据时间范围设置日期
    const now = dayjs();
    switch (value) {
      case 'today':
        setDateRange([now.startOf('day'), now.endOf('day')]);
        break;
      case 'week':
        setDateRange([now.subtract(7, 'day'), now]);
        break;
      case 'month':
        setDateRange([now.subtract(30, 'day'), now]);
        break;
      default:
        break;
    }
  };

  return (
    <PageContainer
      title="反欺诈数据仪表盘"
      subTitle="实时监控反欺诈系统运行状态和风险趋势"
      extra={
        <Space>
          <Select value={timeRange} onChange={handleTimeRangeChange} style={{ width: 120 }}>
            <Option value="today">今日</Option>
            <Option value="week">近7天</Option>
            <Option value="month">近30天</Option>
          </Select>
          <RangePicker
            value={dateRange}
            onChange={(dates) => dates && setDateRange(dates)}
            style={{ width: 240 }}
          />
          <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
            刷新
          </Button>
        </Space>
      }
    >
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总申请数"
              value={1128}
              prefix={<SecurityScanOutlined style={{ color: chartColors.primary }} />}
              valueStyle={{ color: chartColors.primary }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="风险拦截"
              value={156}
              prefix={<WarningOutlined style={{ color: chartColors.warning }} />}
              valueStyle={{ color: chartColors.warning }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="通过审核"
              value={972}
              prefix={<CheckCircleOutlined style={{ color: chartColors.success }} />}
              valueStyle={{ color: chartColors.success }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="拒绝申请"
              value={156}
              prefix={<CloseCircleOutlined style={{ color: chartColors.error }} />}
              valueStyle={{ color: chartColors.error }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        {/* 风险趋势图 */}
        <Col xs={24} lg={16}>
          <EChartsCard
            title="风险趋势分析"
            option={generateLineChartOption({
              ...mockData.riskTrend,
              title: '24小时风险趋势',
              xAxisLabel: '时间',
              yAxisLabel: '数量',
            })}
            height={400}
            loading={loading}
          />
        </Col>

        {/* 风险评分仪表盘 */}
        <Col xs={24} lg={8}>
          <EChartsCard
            title="平均风险评分"
            option={generateGaugeChartOption({
              value: 68,
              max: 100,
              title: '风险评分',
              unit: '分',
              color: chartColors.warning,
            })}
            height={400}
            loading={loading}
          />
        </Col>

        {/* 欺诈类型分布 */}
        <Col xs={24} lg={12}>
          <EChartsCard
            title="欺诈类型分布"
            option={generatePieChartOption({
              data: mockData.fraudTypes,
              title: '欺诈类型占比',
              radius: ['40%', '70%'],
            })}
            height={350}
            loading={loading}
          />
        </Col>

        {/* 处理流程漏斗 */}
        <Col xs={24} lg={12}>
          <EChartsCard
            title="申请处理流程"
            option={generateFunnelChartOption({
              data: mockData.processFunnel,
              title: '处理流程漏斗',
            })}
            height={350}
            loading={loading}
          />
        </Col>

        {/* 规则命中率 */}
        <Col xs={24} lg={12}>
          <EChartsCard
            title="规则命中率"
            option={generateBarChartOption({
              ...mockData.ruleHitRate,
              title: '各规则命中率',
              xAxisLabel: '规则类型',
              yAxisLabel: '命中率(%)',
            })}
            height={350}
            loading={loading}
          />
        </Col>

        {/* 风险评分分布 */}
        <Col xs={24} lg={12}>
          <EChartsCard
            title="风险评分分布"
            option={generateBarChartOption({
              ...mockData.riskScoreDistribution,
              title: '用户风险评分分布',
              xAxisLabel: '评分区间',
              yAxisLabel: '用户数量',
            })}
            height={350}
            loading={loading}
          />
        </Col>

        {/* 风险雷达图 */}
        <Col xs={24}>
          <EChartsCard
            title="多维度风险分析"
            option={generateRadarChartOption({
              ...mockData.riskRadar,
              title: '风险维度对比',
            })}
            height={400}
            loading={loading}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AntiFraudDashboard;
