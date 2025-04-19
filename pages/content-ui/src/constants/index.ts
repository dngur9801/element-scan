export const OVERLAY_HEIGHT = 400;
export const OVERLAY_WIDTH = 300;
export const CURSOR_OFFSET = 15;

export const COPY_ICON = 'content-ui/copy.svg';
export const CHECK_ICON = 'content-ui/check.svg';
export const PIN_ICON = 'content-ui/pin.svg';
export const DRAG_ICON = 'content-ui/drag.svg';

export const Z_INDEX = {
  TOGGLE_BTN: 99991,
  SELECTED_HIGHLIGHT_OVERLAY: 99992,
  HOVER_HIGHLIGHT_OVERLAY: 99993,
  ELEMENT_INFO_OVERLAY: 99994,
  ELEMENT_GUIDE_LINE: 99995,
  SPACING_GUIDE_LINE: 99996,
} as const;

export const ELEMENT_ID = {
  ROOT: 'element-scan-root',
  SHADOW_ROOT: 'element-scan-shadow-root',
  TOGGLE_BTN: 'element-scan-toggle-btn',
  HOVER_HIGHLIGHT_OVERLAY: 'element-scan-hover-highlight-overlay',
  SELECTED_HIGHLIGHT_OVERLAY: 'element-scan-selected-highlight-overlay',
  ELEMENT_INFO_OVERLAY: 'element-scan-element-info-overlay',
} as const;
