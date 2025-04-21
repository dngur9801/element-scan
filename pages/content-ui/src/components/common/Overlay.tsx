import { cn } from '@extension/ui';
import { Z_INDEX } from '@src/constants';
import { useRef, useEffect } from 'react';

type OverlayProps = {
  element: Element | null;
  borderColor: string;
  bgColor: string;
  id: string;
  zIndex: number;
  shouldShowGuidelines?: boolean;
  condition?: boolean;
};

export default function Overlay({
  element,
  borderColor,
  bgColor,
  id,
  zIndex,
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
      overlay.style.transform = `translate(${rect.left + window.scrollX}px, ${rect.top + window.scrollY}px)`;
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;
      overlay.style.display = 'block';

      // 가이드라인 표시가 활성화된 경우만 보여줌
      if (shouldShowGuidelines) {
        // 수평 가이드라인 (top)
        if (topRef.current) {
          topRef.current.style.transform = `translate(0px, ${rect.top + window.scrollY + 1}px)`;
          topRef.current.style.width = `100vw`;
          topRef.current.style.display = 'block';
        }

        // 수직 가이드라인 (left)
        if (leftRef.current) {
          leftRef.current.style.transform = `translate(${rect.left + window.scrollX}px, 0px)`;
          leftRef.current.style.height = `${document.documentElement.scrollHeight}px`;
          leftRef.current.style.display = 'block';
        }

        // 수직 가이드라인 (right)
        if (rightRef.current) {
          rightRef.current.style.transform = `translate(${rect.right + window.scrollX - 1}px, 0px)`;
          rightRef.current.style.height = `${document.documentElement.scrollHeight}px`;
          rightRef.current.style.display = 'block';
        }

        // 수평 가이드라인 (bottom)
        if (bottomRef.current) {
          bottomRef.current.style.transform = `translate(0px, ${rect.bottom + window.scrollY - 1}px)`;
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

  const guidelineClassName = `absolute pointer-events-none border-0 border-dashed ${borderColor} box-border hidden top-0 left-0`;

  return (
    <>
      <div
        ref={overlayRef}
        className={`absolute pointer-events-none border-2 ${borderColor} ${bgColor} box-border hidden top-0 left-0`}
        style={{ zIndex: zIndex }}
        id={id}
      />

      <div
        ref={topRef}
        className={cn(guidelineClassName, 'h-[1px]', 'border-t')}
        style={{ zIndex: Z_INDEX.ELEMENT_GUIDE_LINE }}
      />
      <div
        ref={rightRef}
        className={cn(guidelineClassName, 'h-[1px]', 'border-l')}
        style={{ zIndex: Z_INDEX.ELEMENT_GUIDE_LINE }}
      />
      <div
        ref={bottomRef}
        className={cn(guidelineClassName, 'w-[1px]', 'border-t')}
        style={{ zIndex: Z_INDEX.ELEMENT_GUIDE_LINE }}
      />
      <div
        ref={leftRef}
        className={cn(guidelineClassName, 'w-[1px]', 'border-l')}
        style={{ zIndex: Z_INDEX.ELEMENT_GUIDE_LINE }}
      />
    </>
  );
}
