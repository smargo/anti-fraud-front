import { EventConfigVersionInfo } from '@/services/antifraud/eventConfigVersion';
import { createContext, useContext } from 'react';

interface EventConfigVersionContextType {
  // 状态
  versionInfo: EventConfigVersionInfo;
  hasUnsavedChanges: boolean;
  isSubmitting: boolean;

  // 方法
  setVersionInfo: (info: EventConfigVersionInfo) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  setIsSubmitting: (submitting: boolean) => void;
  saveDraftConfig: (configData: any) => Promise<void>;
}

const EventConfigVersionContext = createContext<EventConfigVersionContextType | undefined>(
  undefined,
);

export const useEventConfigVersionContext = () => {
  const context = useContext(EventConfigVersionContext);
  if (!context) {
    throw new Error('useEventConfigVersionContext must be used within EventConfigVersionProvider');
  }
  return context;
};
