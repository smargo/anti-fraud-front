/**
 * StatementViewModal 组件
 */

import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import moment from 'moment';
import { getDictText, type DictItem } from '@/utils/dictUtils';
import type { StatementItem } from '../types';

interface StatementViewModalProps {
  visible: boolean;
  viewingStatement: StatementItem | null;
  mongoOperateOptions: DictItem[];
  onCancel: () => void;
}

const StatementViewModal: React.FC<StatementViewModalProps> = ({
  visible,
  viewingStatement,
  mongoOperateOptions,
  onCancel,
}) => {
  return (
    <Modal
      title="处理语句详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      {viewingStatement && (
        <Descriptions 
          bordered 
          column={2}
          size="middle"
        >
          <Descriptions.Item label="语句ID" span={2}>
            {viewingStatement.id}
          </Descriptions.Item>
          
          <Descriptions.Item label="语句编号">
            <Tag color="green">{viewingStatement.statementNo}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="数据源编号">
            <Tag color="blue">{viewingStatement.dataSourceNo}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="语句描述" span={2}>
            <div style={{ 
              padding: '8px 12px', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '4px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {viewingStatement.statementDesc || '无'}
            </div>
          </Descriptions.Item>
          
          <Descriptions.Item label="Bean ID" span={2}>
            <Tag color="orange">{viewingStatement.beanId || '无'}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="参数定义" span={2}>
            <div style={{ 
              padding: '8px 12px', 
              backgroundColor: '#fff7e6', 
              borderRadius: '4px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}>
              {viewingStatement.statementParam || '无'}
            </div>
          </Descriptions.Item>
          
          <Descriptions.Item label="返回值列表" span={2}>
            <Tag color="purple">{viewingStatement.resultList || '无'}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="语句内容" span={2}>
            <div style={{ 
              padding: '8px 12px', 
              backgroundColor: '#f0f0f0', 
              borderRadius: '4px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: 'monospace',
              fontSize: '12px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {viewingStatement.statementString || '无'}
            </div>
          </Descriptions.Item>

          {/* MongoDB配置信息 */}
          {viewingStatement.mongoOperationType && (
            <>
              <Descriptions.Item label="MongoDB操作类型">
                <Tag color="blue">
                  {getDictText(mongoOperateOptions, viewingStatement.mongoOperationType) || viewingStatement.mongoOperationType}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="MongoDB数据库">
                <Tag color="green">{viewingStatement.mongoDatabase}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="MongoDB集合">
                <Tag color="orange">{viewingStatement.mongoCollection}</Tag>
              </Descriptions.Item>
            </>
          )}
          
          <Descriptions.Item label="创建时间">
            {moment(viewingStatement.createdDate).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          
          <Descriptions.Item label="创建人">
            {viewingStatement.createdBy || '无'}
          </Descriptions.Item>
          
          <Descriptions.Item label="最后修改时间">
            {viewingStatement.lastModifiedDate ? 
              moment(viewingStatement.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss') : 
              '无'
            }
          </Descriptions.Item>
          
          <Descriptions.Item label="最后修改人">
            {viewingStatement.lastModifiedBy || '无'}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default StatementViewModal;

