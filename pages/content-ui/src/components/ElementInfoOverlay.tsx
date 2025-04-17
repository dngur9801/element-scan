import { useElementScanStore } from '@extension/shared';
import { cn } from '@extension/ui';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/shallow';
import { styleGroupsToCSSText } from '@src/utils';

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
      {elementInfo ? (
        <>
          {/* 헤더 영역 */}
          <div className="p-3 pb-2 border-b border-gray-700">
            <div className="font-mono text-sm text-gray-300">
              {elementInfo.tagName}.{elementInfo.className}
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-400">
                {elementInfo.width} × {elementInfo.height}
              </div>
            </div>
          </div>

          {/* 콘텐츠 영역 */}
          <div className="flex-1 overflow-y-auto font-mono">
            {/* 스타일 없는 경우 */}
            {(!elementInfo.styleGroups || elementInfo.styleGroups.length === 0) && (
              <div className="p-3 text-xs text-gray-400 text-center">추출된 스타일이 없습니다.</div>
            )}

            {/* 스타일 그룹별 표시 */}
            {elementInfo.styleGroups &&
              elementInfo.styleGroups.map(group => (
                <div key={group.name} className="border-b border-gray-700 last:border-b-0">
                  {/* 그룹 헤더 */}
                  <div className="w-full flex justify-between items-center p-2 bg-gray-800 hover:bg-gray-700 transition">
                    <div className="flex items-center">
                      <span className="text-xs text-blue-300">{group.name}</span>
                    </div>
                  </div>

                  {/* 그룹 내용 */}
                  <div className="p-2">
                    {Object.entries(group.styles).map(([property, value]) => (
                      <div key={property} className="flex justify-between items-center mb-1 px-1">
                        <span className="text-xs text-blue-300 truncate max-w-[45%]" title={property}>
                          {property}
                        </span>
                        <span className="text-xs text-yellow-300 truncate max-w-[50%]" title={value}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          {/* 푸터 영역 */}
          <div className="grid grid-cols-2 gap-2 p-2 border-t border-gray-700">
            <button
              className="bg-gray-600 hover:bg-gray-500 text-white text-xs py-2 px-4 rounded transition"
              onClick={() => {
                const css = styleGroupsToCSSText(elementInfo.styleGroups);
                navigator.clipboard.writeText(css);
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
        </>
      ) : (
        <div className="p-3 pb-2">
          <div className="font-mono text-sm text-gray-300">엘리먼트 정보가 없습니다.</div>
        </div>
      )}
    </div>
  );
}
