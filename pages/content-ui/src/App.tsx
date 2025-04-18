import ToggleButton from './components/ToggleButton';
import ElementInfoOverlay from './components/ElementInfoOverlay';
import { useElementScanEvents } from './hook';
import HighlightOverlay from './components/HighlightOverlay';

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
