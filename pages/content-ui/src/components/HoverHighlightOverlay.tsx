import { useElementScanStore, ELEMENT_ID } from '@extension/shared';
import { useShallow } from 'zustand/shallow';
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
    />
  );
}
