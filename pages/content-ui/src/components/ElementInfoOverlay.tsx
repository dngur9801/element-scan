import { useElementScanStore } from '@extension/shared';
import { cn } from '@extension/ui';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/shallow';

const OVERLAY_HEIGHT = 400;
const OVERLAY_WIDTH = 300;

export default function ElementInfoOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { hoveredElement, elementInfo, isPinned, togglePin } = useElementScanStore(
    useShallow(state => ({
      hoveredElement: state.hoveredElement,
      elementInfo: state.elementInfo,
      isPinned: state.isPinned,
      togglePin: state.togglePin,
    })),
  );

  useEffect(() => {
    if (!overlayRef.current) return;

    if (hoveredElement) {
      const overlay = overlayRef.current;
      const rect = hoveredElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // 좌측 하단 기본 위치 설정
      let left = rect.left;
      let top = rect.bottom + 10;

      // 화면 아래쪽에 공간이 부족한 경우 요소 위에 표시
      if (top + OVERLAY_HEIGHT > viewportHeight) {
        top = Math.max(0, rect.top - (OVERLAY_HEIGHT + 10));
      }

      // 왼쪽에 공간이 부족한 경우 오른쪽으로 조정
      if (left + OVERLAY_WIDTH > viewportWidth) {
        left = Math.max(0, viewportWidth - OVERLAY_WIDTH - 10);
      }

      overlay.style.display = 'flex';
      overlay.style.left = `${left}px`;
      overlay.style.top = `${top}px`;
    } else {
      overlayRef.current.style.display = 'none';
    }
  }, [hoveredElement]);

  return (
    <div
      ref={overlayRef}
      style={{ width: `${OVERLAY_WIDTH}px`, height: `${OVERLAY_HEIGHT}px` }}
      className={cn(
        `fixed z-[99999] bg-[#292D3E] text-white rounded-md shadow-lg text-sm font-mono leading-normal transition-opacity duration-300 ease-in-out box-border flex flex-col`,
        hoveredElement ? 'opacity-100' : 'opacity-0',
      )}
      id="element-scan-info-overlay">
      <div className="p-3 pb-2">
        <div className="font-mono text-sm text-gray-300">
          {elementInfo.tagName}.{elementInfo.className}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {elementInfo.width} × {elementInfo.height}
        </div>
      </div>
      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto font-mono">
        <div className="p-3">
          {Object.entries(elementInfo.styles).map(([property, value]) => (
            <div key={property} className="flex justify-between items-center mb-1">
              <span className="text-xs text-blue-300">{property}</span>
              <span className="text-xs text-yellow-300">{value}</span>
            </div>
          ))}
        </div>
      </div>
      {/* 푸터 영역 */}
      <div className="grid grid-cols-2 gap-2 p-2 border-t border-gray-700">
        <button
          className="bg-gray-600 hover:bg-gray-500 text-white text-xs py-2 px-4 rounded transition"
          onClick={() => {
            //카피
          }}>
          Copy CSS
        </button>
        <button
          className={cn(
            'text-white text-xs py-2 px-4 rounded transition',
            isPinned ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-600 hover:bg-gray-500',
          )}
          onClick={() => {
            togglePin();
          }}>
          {isPinned ? '고정 해제' : '요소 클릭 시 고정'}
        </button>
      </div>
    </div>
  );
}
