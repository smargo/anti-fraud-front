// ECharts 图表配置工具函数

// 基础颜色配置
export const chartColors = {
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#13c2c2',
  purple: '#722ed1',
  orange: '#fa8c16',
  pink: '#eb2f96',
  cyan: '#13c2c2',
  lime: '#a0d911',
  gold: '#faad14',
  volcano: '#fa541c',
  magenta: '#eb2f96',
  blue: '#1890ff',
  geekblue: '#2f54eb',
  green: '#52c41a',
  red: '#ff4d4f',
};

// 渐变色配置
export const gradientColors = {
  blue: ['#4B8CFF', '#A0C8FF'],
  green: ['#52c41a', '#95de64'],
  orange: ['#fa8c16', '#ffc53d'],
  purple: ['#722ed1', '#b37feb'],
  red: ['#ff4d4f', '#ff7875'],
};

// 基础图表配置
export const baseChartConfig = {
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: 'transparent',
    textStyle: {
      color: '#fff',
      fontSize: 12,
    },
  },
  legend: {
    textStyle: {
      color: '#666',
      fontSize: 12,
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
};

// 生成柱状图配置
export const generateBarChartOption = (data: {
  categories: string[];
  series: Array<{
    name: string;
    data: number[];
    color?: string;
  }>;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}) => {
  const { categories, series, title, xAxisLabel, yAxisLabel } = data;

  return {
    title: title
      ? {
          text: title,
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
          },
        }
      : undefined,
    tooltip: {
      ...baseChartConfig.tooltip,
      formatter: (params: any) => {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach((param: any) => {
          result += `${param.marker}${param.seriesName}: ${param.value}<br/>`;
        });
        return result;
      },
    },
    legend: {
      ...baseChartConfig.legend,
      data: series.map((s) => s.name),
      top: 30,
    },
    grid: {
      ...baseChartConfig.grid,
      top: title ? 80 : 60,
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        color: '#666',
        fontSize: 12,
      },
      name: xAxisLabel,
      nameTextStyle: {
        color: '#666',
        fontSize: 12,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#666',
        fontSize: 12,
      },
      name: yAxisLabel,
      nameTextStyle: {
        color: '#666',
        fontSize: 12,
      },
    },
    series: series.map((s, index) => ({
      name: s.name,
      type: 'bar',
      data: s.data,
      itemStyle: {
        color: s.color || chartColors.primary,
      },
      barWidth: '60%',
    })),
  };
};

// 生成折线图配置
export const generateLineChartOption = (data: {
  categories: string[];
  series: Array<{
    name: string;
    data: number[];
    color?: string;
    smooth?: boolean;
  }>;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}) => {
  const { categories, series, title, xAxisLabel, yAxisLabel } = data;

  return {
    title: title
      ? {
          text: title,
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
          },
        }
      : undefined,
    tooltip: {
      ...baseChartConfig.tooltip,
      formatter: (params: any) => {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach((param: any) => {
          result += `${param.marker}${param.seriesName}: ${param.value}<br/>`;
        });
        return result;
      },
    },
    legend: {
      ...baseChartConfig.legend,
      data: series.map((s) => s.name),
      top: 30,
    },
    grid: {
      ...baseChartConfig.grid,
      top: title ? 80 : 60,
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        color: '#666',
        fontSize: 12,
      },
      name: xAxisLabel,
      nameTextStyle: {
        color: '#666',
        fontSize: 12,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#666',
        fontSize: 12,
      },
      name: yAxisLabel,
      nameTextStyle: {
        color: '#666',
        fontSize: 12,
      },
    },
    series: series.map((s, index) => ({
      name: s.name,
      type: 'line',
      data: s.data,
      smooth: s.smooth !== false,
      lineStyle: {
        color: s.color || chartColors.primary,
        width: 2,
      },
      itemStyle: {
        color: s.color || chartColors.primary,
      },
      symbol: 'circle',
      symbolSize: 6,
    })),
  };
};

// 生成饼图配置
export const generatePieChartOption = (data: {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  title?: string;
  radius?: string | [string, string];
  showLabel?: boolean;
  showLegend?: boolean;
}) => {
  const { data: pieData, title, radius = '50%', showLabel = true, showLegend = true } = data;

  return {
    title: title
      ? {
          text: title,
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
          },
        }
      : undefined,
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
    },
    legend: showLegend
      ? {
          ...baseChartConfig.legend,
          orient: 'vertical',
          left: 'left',
          top: 'middle',
          data: pieData.map((item) => item.name),
        }
      : undefined,
    series: [
      {
        name: '数据',
        type: 'pie',
        radius: radius,
        center: showLegend ? ['60%', '50%'] : ['50%', '50%'],
        data: pieData.map((item) => ({
          ...item,
          itemStyle: {
            color: item.color || chartColors.primary,
          },
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        label: showLabel
          ? {
              show: true,
              formatter: '{b}: {d}%',
              fontSize: 12,
              color: '#666',
            }
          : {
              show: false,
            },
        labelLine: {
          show: showLabel,
        },
      },
    ],
  };
};

// 生成漏斗图配置
export const generateFunnelChartOption = (data: {
  data: Array<{
    name: string;
    value: number;
  }>;
  title?: string;
}) => {
  const { data: funnelData, title } = data;

  return {
    title: title
      ? {
          text: title,
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
          },
        }
      : undefined,
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
    },
    series: [
      {
        name: '漏斗',
        type: 'funnel',
        left: '10%',
        top: title ? 80 : 60,
        width: '80%',
        height: '80%',
        min: 0,
        max: Math.max(...funnelData.map((item) => item.value)),
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}: {c}',
          fontSize: 12,
          color: '#fff',
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid',
          },
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1,
        },
        emphasis: {
          label: {
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
        data: funnelData,
      },
    ],
  };
};

// 生成仪表盘配置
export const generateGaugeChartOption = (data: {
  value: number;
  max?: number;
  title?: string;
  unit?: string;
  color?: string;
}) => {
  const { value, max = 100, title, unit = '', color = chartColors.primary } = data;

  return {
    title: title
      ? {
          text: title,
          left: 'center',
          top: 20,
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
          },
        }
      : undefined,
    series: [
      {
        name: '指标',
        type: 'gauge',
        center: ['50%', '60%'],
        radius: '80%',
        min: 0,
        max: max,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.3, chartColors.error],
              [0.7, chartColors.warning],
              [1, chartColors.success],
            ],
          },
        },
        pointer: {
          itemStyle: {
            color: 'auto',
          },
        },
        axisTick: {
          distance: -30,
          splitNumber: 5,
          lineStyle: {
            width: 2,
            color: '#999',
          },
        },
        splitLine: {
          distance: -30,
          length: 30,
          lineStyle: {
            width: 4,
            color: '#999',
          },
        },
        axisLabel: {
          color: 'auto',
          distance: 40,
          fontSize: 12,
        },
        detail: {
          valueAnimation: true,
          formatter: `{value}${unit}`,
          color: 'auto',
          fontSize: 20,
          fontWeight: 'bold',
        },
        data: [
          {
            value: value,
            name: title || '指标',
          },
        ],
      },
    ],
  };
};

// 生成雷达图配置
export const generateRadarChartOption = (data: {
  indicators: Array<{
    name: string;
    max: number;
  }>;
  series: Array<{
    name: string;
    data: number[];
    color?: string;
  }>;
  title?: string;
}) => {
  const { indicators, series, title } = data;

  return {
    title: title
      ? {
          text: title,
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
          },
        }
      : undefined,
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
    },
    legend: {
      ...baseChartConfig.legend,
      data: series.map((s) => s.name),
      top: 30,
    },
    radar: {
      center: ['50%', '60%'],
      radius: '70%',
      indicator: indicators,
      name: {
        textStyle: {
          color: '#666',
          fontSize: 12,
        },
      },
      splitLine: {
        lineStyle: {
          color: '#e5e5e5',
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(250, 250, 250, 0.3)', 'rgba(200, 200, 200, 0.1)'],
        },
      },
    },
    series: [
      {
        name: '数据',
        type: 'radar',
        data: series.map((s) => ({
          value: s.data,
          name: s.name,
          itemStyle: {
            color: s.color || chartColors.primary,
          },
          areaStyle: {
            color: s.color || chartColors.primary,
            opacity: 0.3,
          },
        })),
      },
    ],
  };
};

