import React, { createContext, useContext, useState, useCallback } from 'react';
import { EventConfigVersion, EventConfigVersionInfo, saveDraft } from '@/services/eventConfigVersion';

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

const EventConfigVersionContext = createContext<EventConfigVersionContextType | undefined>(undefined);

export const useEventConfigVersionContext = () => {
  const context = useContext(EventConfigVersionContext);
  if (!context) {
    throw new Error('useEventConfigVersionContext must be used within EventConfigVersionProvider');
  }
  return context;
};

interface EventConfigVersionProviderProps {
  children: React.ReactNode;
  initialVersionInfo: EventConfigVersionInfo;
}

export const EventConfigVersionProvider: React.FC<EventConfigVersionProviderProps> = ({
  children,
  initialVersionInfo,
}) => {
  const [versionInfo, setVersionInfo] = useState<EventConfigVersionInfo>(initialVersionInfo);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const saveDraftConfig = useCallback(async (configData: any) => {
    if (!versionInfo.workingDraftVersion) {
      throw new Error('没有可保存的草稿版本');
    }

    setIsSubmitting(true);
    try {
      await saveDraft(versionInfo.workingDraftVersion.id, configData);
      setHasUnsavedChanges(false);
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [versionInfo.workingDraftVersion]);

  const value: EventConfigVersionContextType = {
    versionInfo,
    hasUnsavedChanges,
    isSubmitting,
    setVersionInfo,
    setHasUnsavedChanges,
    setIsSubmitting,
    saveDraftConfig,
  };

  return (
    <EventConfigVersionContext.Provider value={value}>
      {children}
    </EventConfigVersionContext.Provider>
  );
};