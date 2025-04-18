import { useElementScanStore, ELEMENT_ID } from '@extension/shared';
import { useRef, useEffect } from 'react';

export default function HighlightOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);

  const hoveredElement = useElementScanStore(state => state.hoveredElement);

  useEffect(() => {
    if (!overlayRef.current) return;

    if (hoveredElement) {
      const rect = hoveredElement.getBoundingClientRect();
      const overlay = overlayRef.current;

      overlay.style.top = `${rect.top + window.scrollY}px`;
      overlay.style.left = `${rect.left + window.scrollX}px`;
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;
      overlay.style.display = 'block';
    } else {
      overlayRef.current.style.display = 'none';
    }
  }, [hoveredElement]);

  return (
    <div
      ref={overlayRef}
      className="absolute pointer-events-none z-[99999] border-2 border-main-500 bg-[rgba(80,250,123,0.15)] box-border hidden"
      id={ELEMENT_ID.HIGHLIGHT_OVERLAY}
    />
  );
}
