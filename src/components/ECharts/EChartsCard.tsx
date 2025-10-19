import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, Spin } from 'antd';
import './index.less';

export interface EChartsCardProps {
  title?: string;
  loading?: boolean;
  height?: number | string;
  width?: number | string;
  option: any;
  className?: string;
  style?: React.CSSProperties;
  onChartReady?: (chart: any) => void;
  onEvents?: Record<string, (params: any) => void>;
}

export const EChartsCard: React.FC<EChartsCardProps> = ({
  title,
  loading = false,
  height = 300,
  width = '100%',
  option,
  className,
  style,
  onChartReady,
  onEvents,
}) => {
  const chartStyle = useMemo(
    () => ({
      height: typeof height === 'number' ? `${height}px` : height,
      width: typeof width === 'number' ? `${width}px` : width,
      ...style,
    }),
    [height, width, style],
  );

  return (
    <Card
      title={title}
      className={`echarts-card ${className || ''}`}
      style={{ marginBottom: 16 }}
      bodyStyle={{ padding: '16px' }}
    >
      <Spin spinning={loading}>
        <ReactECharts
          option={option}
          style={chartStyle}
          onChartReady={onChartReady}
          onEvents={onEvents}
          opts={{
            renderer: 'canvas',
            useDirtyRect: true,
          }}
        />
      </Spin>
    </Card>
  );
};

export default EChartsCard;
