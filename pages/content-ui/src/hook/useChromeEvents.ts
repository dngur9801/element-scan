import { useElementScanStore } from '@extension/shared';
import { useEffect } from 'react';

export const useChromeEvents = () => {
  const { toggleScan, toggleElementScanButtonVisible } = useElementScanStore();
  useEffect(() => {
    chrome.runtime.onMessage.addListener(message => {
      if (message.action === 'toggleElementScan') {
        toggleScan(message.value);
      }
    });

    chrome.runtime.onMessage.addListener(message => {
      if (message.action === 'toggleElementScanButtonVisible') {
        toggleElementScanButtonVisible(message.value);
      }
    });
  }, []);
};
