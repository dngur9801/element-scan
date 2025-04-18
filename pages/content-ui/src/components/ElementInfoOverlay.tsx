import { useElementScanStore, ELEMENT_ID } from '@extension/shared';
import { cn } from '@extension/ui';
import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { styleGroupsToCSSText } from '@src/utils';
import { colorManager } from '@src/utils/colorManager';

const OVERLAY_HEIGHT = 400;
const OVERLAY_WIDTH = 300;
const CURSOR_OFFSET = 15;

export default function ElementInfoOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [editingStyle, setEditingStyle] = useState<{ property: string; groupName: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { hoveredElement, elementInfo, isPinned, togglePin, updateElementStyle } = useElementScanStore(
    useShallow(state => ({
      hoveredElement: state.hoveredElement,
      elementInfo: state.elementInfo,
      isPinned: state.isPinned,
      togglePin: state.togglePin,
      updateElementStyle: state.updateElementStyle,
    })),
  );

  useEffect(() => {
    if (editingStyle && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingStyle]);

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

        overlay.style.display = 'flex';
        overlay.style.left = `${left}px`;
        overlay.style.top = `${top}px`;
      } else {
        overlayRef.current.style.display = 'none';
      }
    }

    updateOverlayPosition();
  }, [hoveredElement, mousePosition, isPinned]);

  const handleStyleDoubleClick = (property: string, value: string, groupName: string) => {
    setEditingStyle({ property, groupName });
    setEditValue(value);
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingStyle || !hoveredElement) return;

    const newValue = e.target.value;
    setEditValue(newValue);

    if (editingStyle.property && newValue) {
      hoveredElement.style.setProperty(editingStyle.property, newValue);

      updateElementStyle(editingStyle.groupName, editingStyle.property, newValue);
    }
  };

  const handleStyleEditComplete = () => {
    setEditingStyle(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleStyleEditComplete();
    }
  };

  return (
    <div
      ref={overlayRef}
      style={{ width: `${OVERLAY_WIDTH}px`, height: `${OVERLAY_HEIGHT}px` }}
      className={cn(
        `fixed z-[99999] bg-white/90 text-white rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-lg text-sm font-mono leading-normal transition-opacity duration-300 ease-in-out box-border flex flex-col border border-gray-100`,
        hoveredElement ? 'opacity-100' : 'opacity-0',
      )}
      id={ELEMENT_ID.ELEMENT_INFO_OVERLAY}>
      {elementInfo ? (
        <>
          {/* 헤더 영역 */}
          <div className="p-3 pb-2 bg-white/50 backdrop-blur-sm">
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
          <div className="flex-1 overflow-y-auto font-mono bg-white/80 pb-10">
            {/* 스타일 없는 경우 */}
            {(!elementInfo.styleGroups || elementInfo.styleGroups.length === 0) && (
              <div className="p-3 text-xs text-gray-700 text-center">추출된 스타일이 없습니다.</div>
            )}

            {/* 스타일 그룹별 표시 */}
            {elementInfo.styleGroups &&
              elementInfo.styleGroups.map(group => (
                <div key={group.name}>
                  {/* 그룹 헤더 */}
                  <div className="w-full flex justify-between items-center p-2 bg-gray-100/80 backdrop-blur-sm">
                    <div className="flex items-center">
                      <span className="text-xs text-black font-medium">{group.name}</span>
                    </div>
                  </div>

                  {/* 그룹 내용 */}
                  <div className="p-2">
                    {Object.entries(group.styles).map(([property, value]) => (
                      <div key={property} className="flex items-center px-1 py-1">
                        <span
                          className="text-[11px] text-gray-600 truncate max-w-[45%] self-start width-[120px] flex-1"
                          title={property}>
                          {property}
                        </span>
                        <div
                          className="text-[11px] text-gray-600 truncate max-w-[50%] whitespace-break-spaces"
                          title={value}
                          onDoubleClick={() => handleStyleDoubleClick(property, value, group.name)}>
                          {editingStyle &&
                          editingStyle.property === property &&
                          editingStyle.groupName === group.name ? (
                            <input
                              type="text"
                              value={editValue}
                              onChange={handleStyleChange}
                              onBlur={handleStyleEditComplete}
                              onKeyDown={handleKeyDown}
                              ref={inputRef}
                              className="w-full text-[11px] text-black bg-white/90 border border-blue-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
                            />
                          ) : colorManager.isColorProperty(property) ? (
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
