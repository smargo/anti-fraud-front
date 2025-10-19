import { Tag } from 'antd';
import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface StatusTagProps {
  value: string;
  options: SelectOption[];
  colorMap?: Record<string, string>;
}

const StatusTag: React.FC<StatusTagProps> = ({ value, options, colorMap = {} }) => {
  const option = options.find((opt) => opt.value === value);
  const color = colorMap[value] || 'default';

  return option ? <Tag color={color}>{option.label}</Tag> : <Tag>{value}</Tag>;
};

export default StatusTag;

