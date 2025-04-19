import {
  ToggleButton,
  ElementInfoOverlay,
  HoverHighlightOverlay,
  SelectedHighlightOverlay,
  SpacingGuideLine,
} from './components';
import { useElementScanEvents } from './hook';

export default function App() {
  useElementScanEvents();

  return (
    <>
      <ToggleButton />
      <HoverHighlightOverlay />
      <SelectedHighlightOverlay />
      <SpacingGuideLine />
      <ElementInfoOverlay />
    </>
  );
}
