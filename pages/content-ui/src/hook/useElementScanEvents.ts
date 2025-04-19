import { useEffect } from 'react';
import { ELEMENT_ID, useElementScanStore } from '@extension/shared';
import { extractElementInfo } from '@src/utils';

export const useElementScanEvents = () => {
  const {
    elementScanActive,
    isPinned,
    hoveredElement,
    selectedElement,
    setHoveredElement,
    toggleScan,
    togglePin,
    setElementInfo,
    setSelectedElement,
  } = useElementScanStore();

  useEffect(() => {
    if (!elementScanActive) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || !(target instanceof HTMLElement)) return;

      if (target === hoveredElement || isPinned) return;

      const elementInfo = extractElementInfo(target);

      setElementInfo(elementInfo);
      setHoveredElement(target);
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isPinned || target !== hoveredElement) return;

      setHoveredElement(null);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.id !== ELEMENT_ID.TOGGLE_BTN && target.id !== ELEMENT_ID.ROOT) {
        // 대상 요소 클릭시 이벤트 중단
        e.preventDefault();
        e.stopPropagation();
      }

      if (target.id === ELEMENT_ID.ROOT) {
        return;
      }

      if (!hoveredElement) {
        setHoveredElement(target);
      }

      setSelectedElement(target);
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
  }, [elementScanActive, hoveredElement, isPinned, selectedElement]);
};
