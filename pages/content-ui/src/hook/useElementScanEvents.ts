// hooks/useElementScanEvents.ts
import { useEffect } from 'react';
import { useElementScanStore } from '@extension/shared';
import { isScanElement } from '@src/utils';

export const useElementScanEvents = () => {
  const { elementScanActive, isPinned, hoveredElement, setHoveredElement, toggleScan, togglePin } =
    useElementScanStore();

  useEffect(() => {
    if (!elementScanActive) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || !(target instanceof HTMLElement)) return;

      if (isScanElement(target) || target === hoveredElement || isPinned) return;

      //   if (hoveredElement && hoveredElement !== target) {
      //     removeHighlight(hoveredElement);
      //   }

      //   applyHighlight(target);
      //   setupOverlay(target);
      console.log('target', target);
      setHoveredElement(target);
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isPinned || target !== hoveredElement) return;

      setHoveredElement(null);
      //   removeHighlight(target);
      //   if (currentOverlay) {
      //     currentOverlay.style.display = 'none';
      //   }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isScanElement(target)) return;

      e.preventDefault();
      e.stopPropagation();

      if (!hoveredElement) {
        setHoveredElement(target);
        // applyHighlight(target);
        // setupOverlay(target);
      }

      togglePin();

      //   if (hoveredElement && currentOverlay) {
      //     updateOverlayWithStyles(hoveredElement);
      //   }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleScan();
      if (e.altKey && e.key === 'c') toggleScan();
    };

    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mouseout', handleMouseOut, true);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('mouseout', handleMouseOut, true);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [elementScanActive, hoveredElement, isPinned]);
};
