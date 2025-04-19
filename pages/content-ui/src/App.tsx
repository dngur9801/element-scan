import { ToggleButton, ElementInfoOverlay, HoverHighlightOverlay } from './components';
import { useElementScanEvents } from './hook';

export default function App() {
  useElementScanEvents();

  return (
    <>
      <ToggleButton />
      <HoverHighlightOverlay />
      <ElementInfoOverlay />
    </>
  );
}
