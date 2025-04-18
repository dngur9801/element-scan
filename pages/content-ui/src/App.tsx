import { ToggleButton, ElementInfoOverlay, HighlightOverlay } from './components';
import { useElementScanEvents } from './hook';

export default function App() {
  useElementScanEvents();

  return (
    <>
      <ToggleButton />
      <HighlightOverlay />
      <ElementInfoOverlay />
    </>
  );
}
