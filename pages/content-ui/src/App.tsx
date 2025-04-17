import { useEffect } from 'react';
import { IS_DEV } from '@extension/env';
import ToggleButton from './components/ToggleButton';
import ElementInfoOverlay from './components/ElementInfoOverlay';
import { useElementScanEvents } from './hook';
import HighlightOverlay from './components/HighlightOverlay';

export default function App() {
  useElementScanEvents();

  useEffect(() => {
    console.log('IS_DEV', IS_DEV);
  }, []);

  return (
    <>
      <ToggleButton />
      <ElementInfoOverlay />
      <HighlightOverlay />
    </>
  );
}
