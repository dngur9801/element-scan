import { useElementScanStore } from '@extension/shared';
import { ELEMENT_ID, Z_INDEX } from '@src/constants';
import Overlay from './common/Overlay';

export default function SelectedHighlightOverlay() {
  const selectedElement = useElementScanStore(state => state.selectedElement);

  return (
    <Overlay
      element={selectedElement}
      borderColor="border-sub-500"
      bgColor="bg-sub-200-opacity"
      id={ELEMENT_ID.SELECTED_HIGHLIGHT_OVERLAY}
      zIndex={Z_INDEX.SELECTED_HIGHLIGHT_OVERLAY}
    />
  );
}
