import { useRef, useEffect } from 'react';

type OverlayProps = {
  element: Element | null;
  borderColor: string;
  bgColor: string;
  id: string;
  shouldShowGuidelines?: boolean;
  condition?: boolean;
};

export default function Overlay({
  element,
  borderColor,
  bgColor,
  id,
  shouldShowGuidelines = true,
  condition = true,
}: OverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const topRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const guidelineRefs = [topRef, leftRef, rightRef, bottomRef];

  useEffect(() => {
    if (!overlayRef.current) return;

    if (element && condition) {
      const rect = element.getBoundingClientRect();
      const overlay = overlayRef.current;

      // 메인 오버레이 포지셔닝
      overlay.style.top = `${rect.top + window.scrollY}px`;
      overlay.style.left = `${rect.left + window.scrollX}px`;
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;
      overlay.style.display = 'block';

      // 가이드라인 표시가 활성화된 경우만 보여줌
      if (shouldShowGuidelines) {
        // 수평 가이드라인 (top)
        if (topRef.current) {
          topRef.current.style.top = `${rect.top + window.scrollY + 1}px`;
          topRef.current.style.left = '0px';
          topRef.current.style.width = `100vw`;
          topRef.current.style.display = 'block';
        }

        // 수직 가이드라인 (left)
        if (leftRef.current) {
          leftRef.current.style.top = '0px';
          leftRef.current.style.left = `${rect.left + window.scrollX}px`;
          leftRef.current.style.height = `${document.documentElement.scrollHeight}px`;
          leftRef.current.style.display = 'block';
        }

        // 수직 가이드라인 (right)
        if (rightRef.current) {
          rightRef.current.style.top = '0px';
          rightRef.current.style.left = `${rect.right + window.scrollX}px`;
          rightRef.current.style.height = `${document.documentElement.scrollHeight}px`;
          rightRef.current.style.display = 'block';
        }

        // 수평 가이드라인 (bottom)
        if (bottomRef.current) {
          bottomRef.current.style.top = `${rect.bottom + window.scrollY - 1}px`;
          bottomRef.current.style.left = '0px';
          bottomRef.current.style.width = `100vw`;
          bottomRef.current.style.display = 'block';
        }
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
  }, [element, condition, shouldShowGuidelines]);

  return (
    <>
      <div
        ref={overlayRef}
        className={`absolute pointer-events-none z-[99999] border-2 ${borderColor} ${bgColor} box-border hidden`}
        id={id}
      />

      <div
        ref={topRef}
        className={`absolute pointer-events-none z-[99998] h-[1px] border-0 border-t border-dashed ${borderColor} box-border hidden`}
      />
      <div
        ref={leftRef}
        className={`absolute pointer-events-none z-[99998] w-[1px] border-0 border-l border-dashed ${borderColor} box-border hidden`}
      />
      <div
        ref={rightRef}
        className={`absolute pointer-events-none z-[99998] h-[1px] border-0 border-l border-dashed ${borderColor} box-border hidden`}
      />
      <div
        ref={bottomRef}
        className={`absolute pointer-events-none z-[99998] w-[1px] border-0 border-t border-dashed ${borderColor} box-border hidden`}
      />
    </>
  );
}
