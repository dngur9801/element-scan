import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import Draggable from 'react-draggable';
import { useElementScanStore } from '@extension/shared';
import { cn } from '@extension/ui';
import { styleGroupsToCSSText } from '@src/utils';
import StyleGroups from './StyleGroups';
import {
  CHECK_ICON,
  COPY_ICON,
  DRAG_ICON,
  PIN_ICON,
  OVERLAY_HEIGHT,
  OVERLAY_WIDTH,
  CURSOR_OFFSET,
  Z_INDEX,
  ELEMENT_ID,
} from '@src/constants';

export default function ElementInfoOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Draggable>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { hoveredElement, elementInfo, isPinned, togglePin } = useElementScanStore(
    useShallow(state => ({
      hoveredElement: state.hoveredElement,
      elementInfo: state.elementInfo,
      isPinned: state.isPinned,
      togglePin: state.togglePin,
      updateElementStyle: state.updateElementStyle,
    })),
  );

  const handleCopyCSS = () => {
    if (!elementInfo) return;
    if (isCopying) return;

    setIsCopying(true);
    setTimeout(() => {
      setIsCopying(false);
    }, 1500);

    const css = styleGroupsToCSSText(elementInfo.styleGroups);
    navigator.clipboard.writeText(css);
  };

  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // 오버레이 위치 업데이트
  useEffect(() => {
    function updateOverlayPosition() {
      if (!overlayRef.current) return;

      if (hoveredElement) {
        if (isPinned) return;

        const overlay = overlayRef.current;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // 마우스 커서 오른쪽에 오버레이 위치 설정
        let left = mousePosition.x + CURSOR_OFFSET;
        let top = mousePosition.y;

        // 오른쪽에 공간이 부족한 경우 왼쪽으로 조정
        if (left + OVERLAY_WIDTH > viewportWidth) {
          left = Math.max(0, mousePosition.x - OVERLAY_WIDTH - CURSOR_OFFSET);
        }

        // 아래쪽에 공간이 부족한 경우 위로 조정
        if (top + OVERLAY_HEIGHT > viewportHeight) {
          top = Math.max(0, viewportHeight - OVERLAY_HEIGHT);
        }

        // 드래그 컴포넌트 대신 CSS로 직접 위치 지정
        overlay.style.transform = '';
        overlay.style.display = 'flex';
        overlay.style.left = `${left}px`;
        overlay.style.top = `${top}px`;
      } else {
        overlayRef.current.style.display = 'none';
        dragRef.current?.setState({ x: 0, y: 0 });
      }
    }

    updateOverlayPosition();
  }, [hoveredElement, mousePosition, isPinned]);

  return (
    <Draggable
      ref={dragRef}
      nodeRef={overlayRef as React.RefObject<HTMLElement>}
      defaultPosition={{ x: 0, y: 0 }}
      bounds="body"
      disabled={!isPinned}
      handle=".drag-handle">
      <div
        ref={overlayRef}
        style={{ width: `${OVERLAY_WIDTH}px`, height: `${OVERLAY_HEIGHT}px`, zIndex: Z_INDEX.ELEMENT_INFO_OVERLAY }}
        className={cn(
          `fixed bg-white/90 text-white rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-lg text-sm font-mono leading-normal transition-opacity duration-300 ease-in-out box-border flex flex-col border border-gray-100`,
          hoveredElement ? 'opacity-100' : 'opacity-0',
        )}
        id={ELEMENT_ID.ELEMENT_INFO_OVERLAY}>
        {elementInfo ? (
          <>
            {/* 헤더 영역 - 드래그 핸들로 사용 */}
            <div className="p-3 pb-2">
              <div className="flex justify-between items-center">
                <p className="font-mono text-sm text-main-900 font-bold">
                  {elementInfo.tagName}
                  {elementInfo.className}
                </p>
                {/* 드래그 핸들러 추가 */}
                <div className="drag-handle cursor-move p-1">
                  <img
                    src={chrome.runtime.getURL(DRAG_ICON)}
                    alt="drag"
                    className="w-[16px] h-[16px] pointer-events-none"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <div className="text-xs text-gray-700">
                  {elementInfo.width} × {elementInfo.height}
                </div>
              </div>
            </div>

            {/* 콘텐츠 영역 */}
            <div className="flex-1 overflow-y-auto font-mono pb-10">
              {/* 스타일 없는 경우 */}
              {(!elementInfo.styleGroups || elementInfo.styleGroups.length === 0) && (
                <div className="p-3 text-xs text-gray-700 text-center">추출된 스타일이 없습니다.</div>
              )}

              <StyleGroups groups={elementInfo.styleGroups} />
            </div>

            {/* 버튼 영역 - 우측 하단에 배치 */}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                className={cn(
                  'w-7 h-7 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-full transition shadow-md',
                  isCopying ? 'bg-green-500 text-white hover:bg-green-400' : '',
                )}
                onClick={handleCopyCSS}
                title={isCopying ? '복사됨!' : 'CSS 복사'}>
                {isCopying ? (
                  <img src={chrome.runtime.getURL(CHECK_ICON)} alt="check" className="w-[16px] h-[16px]" />
                ) : (
                  <img src={chrome.runtime.getURL(COPY_ICON)} alt="copy" className="w-[16px] h-[16px]" />
                )}
              </button>
              <button
                className={cn(
                  'w-7 h-7 flex items-center justify-center text-white rounded-full transition shadow-md',
                  isPinned ? 'bg-main-600 hover:bg-main-500' : 'bg-gray-700 hover:bg-gray-600',
                )}
                onClick={() => togglePin()}
                title={isPinned ? '고정 해제' : '요소 클릭 시 고정'}>
                <img src={chrome.runtime.getURL(PIN_ICON)} alt="pin" className="w-[16px] h-[16px]" />
              </button>
            </div>
          </>
        ) : (
          <div className="p-3 pb-2">
            <div className="font-mono text-sm text-gray-500">엘리먼트 정보가 없습니다.</div>
          </div>
        )}
      </div>
    </Draggable>
  );
}
