import {
  ToggleButton,
  ElementInfoOverlay,
  HoverHighlightOverlay,
  SelectedHighlightOverlay,
  ElementConnectionLine,
} from './components';
import { useElementScanEvents } from './hook';

export default function App() {
  useElementScanEvents();

  return (
    <>
      <ToggleButton />
      <HoverHighlightOverlay />
      <SelectedHighlightOverlay />
      <ElementConnectionLine />
      <ElementInfoOverlay />
    </>
  );
}
