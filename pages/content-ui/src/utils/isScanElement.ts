export const isScanElement = (target: HTMLElement): boolean => {
  return !!(
    target.id === 'element-scan-overlay' ||
    target.closest('#element-scan-overlay') ||
    target.id === 'element-scan-toggle-btn' ||
    target.closest('.element-scan-toggle-container') ||
    target.id === 'element-scan-bulk-edit-overlay' ||
    target.closest('#element-scan-bulk-edit-overlay') ||
    target.id === 'element-scan-highlight-overlay'
  );
};
