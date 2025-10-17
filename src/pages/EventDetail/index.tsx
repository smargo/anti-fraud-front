import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Descriptions, Spin, message, Tag } from 'antd';
import { useParams } from 'react-router-dom';
import { getEventDetailRecord } from '@/services/event';
import moment from 'moment';

interface EventDetailRecord {
  id: string;
  eventTransNo: string;
  eventNo: string;
  eventType: string;
  source: string;
  content: string;
  eventTime: string;
  status: string;
  result: string;
  rejectCode: string;
  resultContent: string;
  processTime: number;
  errorMessage: string;
  retryCount: number;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

const EventDetail: React.FC = () => {
  const { eventTransNo } = useParams<{ eventTransNo: string }>();
  const [eventDetail, setEventDetail] = useState<EventDetailRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetail = async () => {
      if (!eventTransNo) return;
      
      try {
        setLoading(true);
        const response = await getEventDetailRecord(eventTransNo);
        if (response?.data) {
          setEventDetail(response.data);
        } else {
          message.error('事件记录不存在');
        }
      } catch (error) {
        message.error('获取事件记录详情失败');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [eventTransNo]);

  if (loading) {
    return (
      <PageContainer>
        <Card>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        </Card>
      </PageContainer>
    );
  }

  if (!eventDetail) {
    return (
      <PageContainer>
        <Card>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>事件记录不存在</p>
          </div>
        </Card>
      </PageContainer>
    );
  }

  // 格式化JSON内容
  const formatContent = () => {
    try {
      const contentObj = JSON.parse(eventDetail.content);
      return JSON.stringify(contentObj, null, 2);
    } catch (e) {
      return eventDetail.content;
    }
  };

  // 状态映射
  const statusMap: Record<string, string> = {
    'INIT': '初始化',
    'PROCESSING': '处理中',
    'COMPLETED': '已完成',
    'FAILED': '失败',
  };

  // 结果映射
  const resultMap: Record<string, string> = {
    'PASS': '通过',
    'REJECT': '拒绝',
    'REVIEW': '人工审核',
  };

  // 事件类型映射
  const eventTypeMap: Record<string, string> = {
    'AUTH': '认证',
    'TRANSACTION': '交易',
    'USER': '用户',
    'FINANCE': '金融',
  };

  // 获取结果标签颜色
  const getResultColor = (result: string) => {
    switch (result) {
      case 'PASS': return 'success';
      case 'REJECT': return 'error';
      case 'REVIEW': return 'warning';
      default: return 'default';
    }
  };

  return (
    <PageContainer>
      <Card title="事件详情记录">
        <Descriptions bordered column={2}>
          <Descriptions.Item label="事件流水号">{eventDetail.eventTransNo}</Descriptions.Item>
          <Descriptions.Item label="事件编号">{eventDetail.eventNo}</Descriptions.Item>
          <Descriptions.Item label="事件类型">{eventTypeMap[eventDetail.eventType] || eventDetail.eventType}</Descriptions.Item>
          <Descriptions.Item label="事件来源">{eventDetail.source}</Descriptions.Item>
          <Descriptions.Item label="事件时间">{moment(eventDetail.eventTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
          <Descriptions.Item label="处理状态">{statusMap[eventDetail.status] || eventDetail.status}</Descriptions.Item>
          <Descriptions.Item label="处理结果">
            <Tag color={getResultColor(eventDetail.result)}>
              {resultMap[eventDetail.result] || eventDetail.result}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="拒绝代码">{eventDetail.rejectCode || '-'}</Descriptions.Item>
          <Descriptions.Item label="处理耗时(毫秒)">{eventDetail.processTime || 0}</Descriptions.Item>
          <Descriptions.Item label="重试次数">{eventDetail.retryCount}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{moment(eventDetail.createdDate).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
          <Descriptions.Item label="创建人">{eventDetail.createdBy}</Descriptions.Item>
          <Descriptions.Item label="最后修改时间">{moment(eventDetail.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
          <Descriptions.Item label="最后修改人">{eventDetail.lastModifiedBy}</Descriptions.Item>
          <Descriptions.Item label="决策返回内容" span={2}>{eventDetail.resultContent || '-'}</Descriptions.Item>
          <Descriptions.Item label="错误信息" span={2}>{eventDetail.errorMessage || '-'}</Descriptions.Item>
          <Descriptions.Item label="事件内容" span={2}>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{formatContent()}</pre>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </PageContainer>
  );
};

export default EventDetail;