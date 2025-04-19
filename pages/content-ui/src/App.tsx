import { ToggleButton, ElementInfoOverlay, HoverHighlightOverlay, SelectedHighlightOverlay } from './components';
import { useElementScanEvents } from './hook';

export default function App() {
  useElementScanEvents();

  return (
    <>
      <ToggleButton />
      <HoverHighlightOverlay />
      <SelectedHighlightOverlay />
      <ElementInfoOverlay />
    </>
  );
}
