/**
 * EventDetail 页面自定义 Hooks
 */

import { useState, useEffect } from 'react';
import { message } from 'antd';
import type { EventDetailRecord } from '../types';
import { fetchEventDetail } from '../helper';

export const useEventDetail = (eventTransNo: string) => {
  const [eventDetail, setEventDetail] = useState<EventDetailRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEventDetail = async () => {
      if (!eventTransNo) return;

      try {
        setLoading(true);
        const detail = await fetchEventDetail(eventTransNo);
        if (detail) {
          setEventDetail(detail);
        } else {
          message.error('事件记录不存在');
        }
      } catch (error) {
        message.error('获取事件记录详情失败');
      } finally {
        setLoading(false);
      }
    };

    loadEventDetail();
  }, [eventTransNo]);

  return {
    eventDetail,
    loading,
  };
};
