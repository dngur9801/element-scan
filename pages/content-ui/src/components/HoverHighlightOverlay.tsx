import { useElementScanStore, ELEMENT_ID } from '@extension/shared';
import { useRef, useEffect } from 'react';

export default function HoverHighlightOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);

  const topRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const hoveredElement = useElementScanStore(state => state.hoveredElement);

  const guidelineRefs = [topRef, leftRef, rightRef, bottomRef];

  useEffect(() => {
    if (!overlayRef.current) return;

    if (hoveredElement) {
      const rect = hoveredElement.getBoundingClientRect();
      const overlay = overlayRef.current;

      // 메인 오버레이 포지셔닝
      overlay.style.top = `${rect.top + window.scrollY}px`;
      overlay.style.left = `${rect.left + window.scrollX}px`;
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;
      overlay.style.display = 'block';

      // 왼쪽 상단 모서리 가이드라인
      if (topRef.current && leftRef.current) {
        // 수평 가이드라인 (왼쪽으로 뻗어나감)
        topRef.current.style.top = `${rect.top + window.scrollY + 1}px`;
        topRef.current.style.left = '0px';
        topRef.current.style.width = `100vw`;
        topRef.current.style.display = 'block';
      }

      if (leftRef.current) {
        leftRef.current.style.top = '0px';
        leftRef.current.style.left = `${rect.left + window.scrollX}px`;
        leftRef.current.style.height = `${document.documentElement.scrollHeight}px`;
        leftRef.current.style.display = 'block';
      }

      if (rightRef.current) {
        rightRef.current.style.top = '0px';
        rightRef.current.style.left = `${rect.right + window.scrollX}px`;
        rightRef.current.style.height = `${document.documentElement.scrollHeight}px`;
        rightRef.current.style.display = 'block';
      }

      if (bottomRef.current) {
        bottomRef.current.style.top = `${rect.bottom + window.scrollY - 1}px`;
        bottomRef.current.style.left = '0px';
        bottomRef.current.style.width = `100vw`;
        bottomRef.current.style.display = 'block';
      }
    } else {
      // 오버레이 숨기기
      overlayRef.current.style.display = 'none';

      // 모든 가이드라인 숨기기
      guidelineRefs.forEach(ref => {
        if (ref.current) {
          ref.current.style.display = 'none';
          ref.current.style.width = '0px';
          ref.current.style.height = '0px';
        }
      });
    }
  }, [hoveredElement]);

  return (
    <>
      <div
        ref={overlayRef}
        className="absolute pointer-events-none z-[99999] border-2 border-main-500 bg-main-200-opacity box-border hidden"
        id={ELEMENT_ID.HIGHLIGHT_OVERLAY}
      />

      <div
        ref={topRef}
        className="absolute pointer-events-none z-[99998] h-[1px] border-0 border-t border-dashed border-main-500 box-border hidden"
      />
      <div
        ref={leftRef}
        className="absolute pointer-events-none z-[99998] w-[1px] border-0 border-l border-dashed border-main-500 box-border hidden"
      />
      <div
        ref={rightRef}
        className="absolute pointer-events-none z-[99998] h-[1px] border-0 border-l border-dashed border-main-500 box-border hidden"
      />
      <div
        ref={bottomRef}
        className="absolute pointer-events-none z-[99998] w-[1px] border-0 border-t border-dashed border-main-500 box-border hidden"
      />
    </>
  );
}
