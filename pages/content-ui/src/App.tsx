import {
  ToggleButton,
  ElementInfoOverlay,
  HoverHighlightOverlay,
  SelectedHighlightOverlay,
  SpacingGuideLine,
} from './components';
import { useElementScanEvents, useChromeEvents } from './hook';

export default function App() {
  useElementScanEvents();
  useChromeEvents();

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
