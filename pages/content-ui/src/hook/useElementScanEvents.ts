import { useEffect } from 'react';
import { useElementScanStore, type ElementType } from '@extension/shared';
import { ELEMENT_ID } from '@src/constants';
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
      const target = e.target as ElementType;
      if (!target || !(target instanceof Element)) return;
      if (target === hoveredElement) return;

      setHoveredElement(target);

      if (!selectedElement) {
        const elementInfo = extractElementInfo(target);
        setElementInfo(elementInfo);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target;
      if (isPinned || target !== hoveredElement) return;

      setHoveredElement(null);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as ElementType;

      if (target instanceof Element && target.id !== ELEMENT_ID.TOGGLE_BTN && target.id !== ELEMENT_ID.ROOT) {
        // 대상 요소 클릭시 이벤트 중단
        e.preventDefault();
        e.stopPropagation();
      }

      if (target instanceof Element && target.id === ELEMENT_ID.ROOT) {
        return;
      }

      if (!hoveredElement) {
        setHoveredElement(target);
      }

      setSelectedElement(selectedElement ? null : target);
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

  // 단축키 등록: Alt + C
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.code === 'KeyC') {
        e.preventDefault();
        toggleScan();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};
