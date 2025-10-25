/**
 * StageTable 组件
 */

import { queryStages } from '@/services/antifraud/stage';
import { convertDictToValueEnum, getDictText, type DictItem } from '@/utils/dictUtils';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-table';
import { Button, Card, Tooltip } from 'antd';
import React from 'react';
import type { StageItem } from '../types';

interface StageTableProps {
  actionRef: React.RefObject<ActionType>;
  stageOptions: DictItem[];
  onView: (record: StageItem) => void;
}

const StageTable: React.FC<StageTableProps> = ({ actionRef, stageOptions, onView }) => {
  // 表格列定义
  const columns: any[] = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 120,
      search: {
        placeholder: '请输入事件编号',
        allowClear: true,
      },
    },
    {
      title: '版本代码',
      dataIndex: 'versionCode',
      key: 'versionCode',
      width: 100,
      search: {
        placeholder: '请输入版本代码',
        allowClear: true,
      },
    },
    {
      title: '处理阶段',
      dataIndex: 'stageNo',
      key: 'stageNo',
      width: 120,
      render: (stage: string) => {
        return getDictText(stageOptions, stage);
      },
      search: {
        valueType: 'select',
        valueEnum: convertDictToValueEnum(stageOptions),
        placeholder: '请选择处理阶段',
        allowClear: true,
      },
    },
    {
      title: '处理名称',
      dataIndex: 'stageName',
      key: 'stageName',
      width: 150,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip placement="topLeft">
          <div
            style={{
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {text || '无'}
          </div>
        </Tooltip>
      ),
      search: false,
    },
    {
      title: '处理组件',
      dataIndex: 'stageBean',
      key: 'stageBean',
      width: 150,
      ellipsis: true,
      render: (bean: string) => (
        <Tooltip placement="topLeft">
          <div
            style={{
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {bean || '无'}
          </div>
        </Tooltip>
      ),
      search: false,
    },
    {
      title: '阶段参数',
      dataIndex: 'stageParam',
      key: 'stageParam',
      width: 120,
      ellipsis: true,
      render: (statementNo: string) => (
        <Tooltip placement="topLeft">
          <div
            style={{
              maxWidth: '100px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {statementNo || '无'}
          </div>
        </Tooltip>
      ),
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 80,
      fixed: 'right',
      render: (_: any, record: StageItem) => (
        <Button type="link" onClick={() => onView(record)}>
          查看
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <ProTable<StageItem, any>
        cardBordered
        actionRef={actionRef}
        toolBarRender={() => []}
        request={async (params) => {
          // 格式化搜索参数
          const searchParams = {
            ...params,
          };

          const response = await queryStages(searchParams);
          // 如果返回的是分页对象，直接返回
          return response;
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        columns={columns}
        rowKey="id"
      />
    </Card>
  );
};

export default StageTable;
