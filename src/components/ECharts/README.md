# ECharts 图表解决方案

本项目已集成 ECharts 图表解决方案，提供了丰富的数据可视化能力。

## 功能特性

- ✅ **多种图表类型**: 支持柱状图、折线图、饼图、漏斗图、仪表盘、雷达图等
- ✅ **响应式设计**: 支持移动端和桌面端自适应
- ✅ **主题定制**: 内置多种颜色主题和样式配置
- ✅ **交互功能**: 支持图表交互、数据钻取、动态更新
- ✅ **性能优化**: 支持 Canvas 渲染和脏矩形优化
- ✅ **类型安全**: 完整的 TypeScript 支持

## 核心组件

### 1. EChartsCard 组件

通用的图表卡片组件：

```tsx
import { EChartsCard } from '../../components/ECharts';

<EChartsCard
  title="风险趋势分析"
  option={chartOption}
  height={400}
  loading={false}
  onChartReady={(chart) => {
    console.log('图表已准备就绪', chart);
  }}
  onEvents={{
    click: (params) => {
      console.log('点击事件', params);
    },
  }}
/>;
```

## 工具函数

### 1. 柱状图配置

```tsx
import { generateBarChartOption } from '../../utils/echarts';

const option = generateBarChartOption({
  categories: ['设备检测', '行为分析', '地理位置'],
  series: [
    {
      name: '命中率',
      data: [85, 72, 68],
      color: '#1890ff',
    },
  ],
  title: '规则命中率',
  xAxisLabel: '规则类型',
  yAxisLabel: '命中率(%)',
});
```

### 2. 折线图配置

```tsx
import { generateLineChartOption } from '../../utils/echarts';

const option = generateLineChartOption({
  categories: ['00:00', '04:00', '08:00', '12:00'],
  series: [
    {
      name: '高风险',
      data: [12, 8, 15, 22],
      color: '#ff4d4f',
      smooth: true,
    },
  ],
  title: '风险趋势',
  xAxisLabel: '时间',
  yAxisLabel: '数量',
});
```

### 3. 饼图配置

```tsx
import { generatePieChartOption } from '../../utils/echarts';

const option = generatePieChartOption({
  data: [
    { name: '设备指纹异常', value: 45, color: '#ff4d4f' },
    { name: '行为模式异常', value: 32, color: '#faad14' },
    { name: '地理位置异常', value: 28, color: '#13c2c2' },
  ],
  title: '欺诈类型分布',
  radius: ['40%', '70%'],
  showLabel: true,
  showLegend: true,
});
```

### 4. 漏斗图配置

```tsx
import { generateFunnelChartOption } from '../../utils/echarts';

const option = generateFunnelChartOption({
  data: [
    { name: '总申请数', value: 1000 },
    { name: '初步筛选', value: 850 },
    { name: '风险评估', value: 720 },
    { name: '最终通过', value: 580 },
  ],
  title: '申请处理流程',
});
```

### 5. 仪表盘配置

```tsx
import { generateGaugeChartOption } from '../../utils/echarts';

const option = generateGaugeChartOption({
  value: 68,
  max: 100,
  title: '风险评分',
  unit: '分',
  color: '#faad14',
});
```

### 6. 雷达图配置

```tsx
import { generateRadarChartOption } from '../../utils/echarts';

const option = generateRadarChartOption({
  indicators: [
    { name: '设备风险', max: 100 },
    { name: '行为风险', max: 100 },
    { name: '位置风险', max: 100 },
  ],
  series: [
    {
      name: '平均风险',
      data: [75, 68, 82],
      color: '#faad14',
    },
  ],
  title: '风险维度分析',
});
```

## 颜色配置

### 基础颜色

```tsx
import { chartColors } from '../../utils/echarts';

// 使用预定义颜色
const colors = {
  primary: chartColors.primary, // #1890ff
  success: chartColors.success, // #52c41a
  warning: chartColors.warning, // #faad14
  error: chartColors.error, // #ff4d4f
  info: chartColors.info, // #13c2c2
  purple: chartColors.purple, // #722ed1
  orange: chartColors.orange, // #fa8c16
  pink: chartColors.pink, // #eb2f96
};
```

### 渐变色

```tsx
import { gradientColors } from '../../utils/echarts';

// 使用渐变色
const gradients = {
  blue: gradientColors.blue, // ['#4B8CFF', '#A0C8FF']
  green: gradientColors.green, // ['#52c41a', '#95de64']
  orange: gradientColors.orange, // ['#fa8c16', '#ffc53d']
};
```

## 使用示例

### 基础图表

```tsx
import React from 'react';
import { EChartsCard } from '../../components/ECharts';
import { generateBarChartOption } from '../../utils/echarts';

const BasicChart = () => {
  const option = generateBarChartOption({
    categories: ['A', 'B', 'C', 'D'],
    series: [
      {
        name: '数据',
        data: [120, 200, 150, 80],
      },
    ],
    title: '基础柱状图',
  });

  return <EChartsCard title="基础图表" option={option} height={300} />;
};
```

### 复杂仪表盘

```tsx
import React, { useState } from 'react';
import { Row, Col } from 'antd';
import { EChartsCard } from '../../components/ECharts';
import {
  generateLineChartOption,
  generatePieChartOption,
  generateGaugeChartOption,
} from '../../utils/echarts';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);

  const trendOption = generateLineChartOption({
    categories: ['1月', '2月', '3月', '4月', '5月'],
    series: [
      {
        name: '销售额',
        data: [120, 132, 101, 134, 90],
        smooth: true,
      },
    ],
    title: '销售趋势',
  });

  const pieOption = generatePieChartOption({
    data: [
      { name: '产品A', value: 335 },
      { name: '产品B', value: 310 },
      { name: '产品C', value: 234 },
    ],
    title: '产品分布',
  });

  const gaugeOption = generateGaugeChartOption({
    value: 75,
    max: 100,
    title: '完成率',
    unit: '%',
  });

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={16}>
        <EChartsCard title="趋势分析" option={trendOption} height={400} loading={loading} />
      </Col>
      <Col xs={24} lg={8}>
        <EChartsCard title="完成率" option={gaugeOption} height={400} loading={loading} />
      </Col>
      <Col xs={24}>
        <EChartsCard title="产品分布" option={pieOption} height={350} loading={loading} />
      </Col>
    </Row>
  );
};
```

### 交互式图表

```tsx
import React from 'react';
import { EChartsCard } from '../../components/ECharts';
import { generateBarChartOption } from '../../utils/echarts';

const InteractiveChart = () => {
  const option = generateBarChartOption({
    categories: ['设备检测', '行为分析', '地理位置'],
    series: [
      {
        name: '命中率',
        data: [85, 72, 68],
      },
    ],
  });

  const handleChartClick = (params: any) => {
    console.log('点击了:', params.name, params.value);
    // 处理点击事件
  };

  const handleChartReady = (chart: any) => {
    console.log('图表已准备就绪');
    // 图表初始化完成后的操作
  };

  return (
    <EChartsCard
      title="交互式图表"
      option={option}
      height={300}
      onChartReady={handleChartReady}
      onEvents={{
        click: handleChartClick,
      }}
    />
  );
};
```

## 响应式设计

ECharts 组件支持响应式设计，会自动适应不同屏幕尺寸：

```tsx
// 移动端优化
<EChartsCard
  title="移动端图表"
  option={option}
  height={250}  // 移动端使用较小的高度
  style={{
    fontSize: '12px',  // 移动端使用较小的字体
  }}
/>

// 桌面端优化
<EChartsCard
  title="桌面端图表"
  option={option}
  height={400}  // 桌面端使用较大的高度
  style={{
    fontSize: '14px',  // 桌面端使用较大的字体
  }}
/>
```

## 性能优化

### 1. 使用 Canvas 渲染

```tsx
<EChartsCard
  option={option}
  opts={{
    renderer: 'canvas', // 使用 Canvas 渲染，性能更好
    useDirtyRect: true, // 启用脏矩形优化
  }}
/>
```

### 2. 数据更新优化

```tsx
import { useMemo } from 'react';

const OptimizedChart = ({ data }: { data: any[] }) => {
  // 使用 useMemo 缓存图表配置
  const option = useMemo(() => {
    return generateBarChartOption({
      categories: data.map((item) => item.name),
      series: [
        {
          name: '数据',
          data: data.map((item) => item.value),
        },
      ],
    });
  }, [data]);

  return <EChartsCard option={option} height={300} />;
};
```

## 最佳实践

1. **合理选择图表类型**: 根据数据特点选择合适的图表类型
2. **优化数据量**: 避免一次性渲染过多数据点
3. **使用缓存**: 对图表配置使用 useMemo 进行缓存
4. **响应式设计**: 为不同屏幕尺寸提供合适的图表尺寸
5. **交互设计**: 合理使用图表交互功能，提升用户体验
6. **性能监控**: 监控图表渲染性能，及时优化

## 参考文档

- [ECharts 官方文档](https://echarts.apache.org/zh/index.html)
- [ECharts-for-React 文档](https://github.com/hustcc/echarts-for-react)
- [ECharts 配置项手册](https://echarts.apache.org/zh/option.html)

