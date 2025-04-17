// hooks/useElementScanEvents.ts
import { useEffect } from 'react';
import { useElementScanStore } from '@extension/shared';
import { ROOT_ID } from '..';

const TOGGLE_BTN_ID = 'element-scan-toggle-btn';

export const useElementScanEvents = () => {
  const { elementScanActive, isPinned, hoveredElement, setHoveredElement, toggleScan, togglePin } =
    useElementScanStore();

  useEffect(() => {
    if (!elementScanActive) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || !(target instanceof HTMLElement)) return;

      if (target === hoveredElement || isPinned) return;

      setHoveredElement(target);
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isPinned || target !== hoveredElement) return;

      setHoveredElement(null);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // 대상 요소 클릭시 이벤트 중단
      if (target.id !== TOGGLE_BTN_ID && target.id !== ROOT_ID) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (!hoveredElement) {
        setHoveredElement(target);
      }

      togglePin();
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
