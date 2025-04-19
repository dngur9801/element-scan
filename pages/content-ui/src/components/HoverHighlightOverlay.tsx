import { useElementScanStore } from '@extension/shared';
import { useShallow } from 'zustand/shallow';
import { ELEMENT_ID, Z_INDEX } from '../constants';
import Overlay from './common/Overlay';

export default function HoverHighlightOverlay() {
  const { hoveredElement, selectedElement } = useElementScanStore(
    useShallow(state => ({
      hoveredElement: state.hoveredElement,
      selectedElement: state.selectedElement,
    })),
  );

  return (
    <Overlay
      element={hoveredElement}
      borderColor="border-main-500"
      bgColor="bg-main-200-opacity"
      id={ELEMENT_ID.HOVER_HIGHLIGHT_OVERLAY}
      shouldShowGuidelines={!selectedElement}
      zIndex={Z_INDEX.HOVER_HIGHLIGHT_OVERLAY}
    />
  );
}
