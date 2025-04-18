import { useElementScanStore, ELEMENT_ID } from '@extension/shared';
import { cn } from '@extension/ui';
import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { styleGroupsToCSSText } from '@src/utils';
import { colorManager } from '@src/utils/colorManager';

const OVERLAY_HEIGHT = 400;
const OVERLAY_WIDTH = 300;

export default function ElementInfoOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isCopying, setIsCopying] = useState(false);

  const { hoveredElement, elementInfo, isPinned, togglePin } = useElementScanStore(
    useShallow(state => ({
      hoveredElement: state.hoveredElement,
      elementInfo: state.elementInfo,
      isPinned: state.isPinned,
      togglePin: state.togglePin,
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
        `fixed z-[99999] bg-white/90 text-white rounded-md shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-lg text-sm font-mono leading-normal transition-opacity duration-300 ease-in-out box-border flex flex-col border border-gray-200`,
        hoveredElement ? 'opacity-100' : 'opacity-0',
      )}
      id={ELEMENT_ID.ELEMENT_INFO_OVERLAY}>
      {elementInfo ? (
        <>
          {/* 헤더 영역 */}
          <div className="p-3 pb-2 bg-white/50 backdrop-blur-sm border-b border-gray-200">
            <div className="font-mono text-sm text-black font-bold">
              {elementInfo.tagName}.{elementInfo.className}
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-700">
                {elementInfo.width} × {elementInfo.height}
              </div>
            </div>
          </div>

          {/* 콘텐츠 영역 */}
          <div className="flex-1 overflow-y-auto font-mono bg-white/80">
            {/* 스타일 없는 경우 */}
            {(!elementInfo.styleGroups || elementInfo.styleGroups.length === 0) && (
              <div className="p-3 text-xs text-gray-700 text-center">추출된 스타일이 없습니다.</div>
            )}

            {/* 스타일 그룹별 표시 */}
            {elementInfo.styleGroups &&
              elementInfo.styleGroups.map(group => (
                <div key={group.name} className="mb-2">
                  {/* 그룹 헤더 */}
                  <div className="w-full flex justify-between items-center p-2 bg-gray-100/80 backdrop-blur-sm">
                    <div className="flex items-center">
                      <span className="text-xs text-black font-medium">{group.name}</span>
                    </div>
                  </div>

                  {/* 그룹 내용 */}
                  <div className="p-2">
                    {Object.entries(group.styles).map(([property, value]) => (
                      <div
                        key={property}
                        className="flex justify-between items-center mb-1 px-1 py-1 hover:bg-gray-100/60 rounded">
                        <span className="text-xs text-gray-600 truncate max-w-[45%] self-start" title={property}>
                          {property}
                        </span>
                        <div
                          className="text-xs text-gray-600 truncate max-w-[50%] whitespace-break-spaces"
                          title={value}>
                          {colorManager.isColorProperty(property) ? (
                            <>
                              <div className="flex items-center gap-1">
                                <div
                                  className="size-3 rounded-[3px] outline-[1px] outline-solid outline-gray-300 shadow-sm"
                                  style={{ backgroundColor: value }}
                                />
                                <span>{value}</span>
                              </div>
                            </>
                          ) : (
                            value
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
              {/* 복사 아이콘 */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-[16px] h-[16px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                {isCopying ? (
                  // 체크 아이콘
                  <path d="M20 6L9 17l-5-5" />
                ) : (
                  // 복사 아이콘
                  <>
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </>
                )}
              </svg>
            </button>
            <button
              className={cn(
                'w-7 h-7 flex items-center justify-center text-white rounded-full transition shadow-md',
                isPinned ? 'bg-main-600 hover:bg-main-500' : 'bg-gray-700 hover:bg-gray-600',
              )}
              onClick={() => togglePin()}
              title={isPinned ? '고정 해제' : '요소 클릭 시 고정'}>
              {/* 핀 아이콘 */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-[16px] h-[16px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div className="p-3 pb-2">
          <div className="font-mono text-sm text-gray-500">엘리먼트 정보가 없습니다.</div>
        </div>
      )}
    </div>
  );
}
