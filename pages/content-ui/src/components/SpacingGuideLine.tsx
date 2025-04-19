import { useEffect, useRef } from 'react';
import { useElementScanStore } from '@extension/shared';
import { useShallow } from 'zustand/shallow';
import { ELEMENT_ID, Z_INDEX } from '@src/constants';
import { cn } from '@extension/ui';

type Direction = 'top' | 'right' | 'bottom' | 'left';

interface LineConfig {
  ref: React.RefObject<HTMLDivElement | null>;
  distanceRef: React.RefObject<HTMLDivElement | null>;
  cssProps: string;
  isHorizontal: boolean;
}

export default function SpacingGuideLine() {
  const { selectedElement, hoveredElement } = useElementScanStore(
    useShallow(state => ({
      selectedElement: state.selectedElement,
      hoveredElement: state.hoveredElement,
    })),
  );

  // 네 방향의 선에 대한 참조 생성
  const topLineRef = useRef<HTMLDivElement>(null);
  const rightLineRef = useRef<HTMLDivElement>(null);
  const bottomLineRef = useRef<HTMLDivElement>(null);
  const leftLineRef = useRef<HTMLDivElement>(null);

  // 픽셀 표시를 위한 요소 참조 생성
  const topDistanceRef = useRef<HTMLDivElement>(null);
  const rightDistanceRef = useRef<HTMLDivElement>(null);
  const bottomDistanceRef = useRef<HTMLDivElement>(null);
  const leftDistanceRef = useRef<HTMLDivElement>(null);

  // 방향별 설정 구성
  const lineConfigs: Record<Direction, LineConfig> = {
    top: {
      ref: topLineRef,
      distanceRef: topDistanceRef,
      cssProps: 'w-0',
      isHorizontal: false,
    },
    right: {
      ref: rightLineRef,
      distanceRef: rightDistanceRef,
      cssProps: 'h-0',
      isHorizontal: true,
    },
    bottom: {
      ref: bottomLineRef,
      distanceRef: bottomDistanceRef,
      cssProps: 'w-0',
      isHorizontal: false,
    },
    left: {
      ref: leftLineRef,
      distanceRef: leftDistanceRef,
      cssProps: 'h-0',
      isHorizontal: true,
    },
  };

  // 부모-자식 관계 확인
  const isParentChildRelationship = (selectedElement: HTMLElement, hoveredElement: HTMLElement): boolean => {
    return hoveredElement.contains(selectedElement);
  };

  // 모든 선 숨기기
  const hideAllLines = () => {
    Object.values(lineConfigs).forEach(config => {
      if (config.ref.current) {
        config.ref.current.style.display = 'none';
      }
      if (config.distanceRef.current) {
        config.distanceRef.current.style.display = 'none';
      }
    });
  };

  // 선 위치와 거리 표시 설정 (통합 함수)
  const setupLine = (direction: Direction, startX: number, startY: number, measurement: number, endPoint: number) => {
    const config = lineConfigs[direction];
    const { ref, distanceRef, isHorizontal } = config;

    if (!ref.current || !distanceRef.current || measurement <= 0) return;

    if (isHorizontal) {
      // 가로 선 (right, left)
      const posX = direction === 'right' ? startX : endPoint;
      ref.current.style.left = `${posX}px`;
      ref.current.style.top = `${startY}px`;
      ref.current.style.width = `${measurement}px`;
      ref.current.style.height = '';

      // 중앙 위치 계산
      const middleX =
        direction === 'right'
          ? startX + measurement / 2 // 오른쪽 방향
          : endPoint + measurement / 2; // 왼쪽 방향
      distanceRef.current.style.left = `${middleX}px`;
      distanceRef.current.style.top = `${startY}px`;
    } else {
      // 세로 선 (top, bottom)
      const posY = direction === 'bottom' ? startY : endPoint;
      ref.current.style.left = `${startX}px`;
      ref.current.style.top = `${posY}px`;
      ref.current.style.height = `${measurement}px`;
      ref.current.style.width = '';

      // 중앙 위치 계산
      const middleY =
        direction === 'bottom'
          ? startY + measurement / 2 // 아래쪽 방향
          : endPoint + measurement / 2; // 위쪽 방향
      distanceRef.current.style.left = `${startX}px`;
      distanceRef.current.style.top = `${middleY}px`;
    }

    ref.current.style.display = 'block';

    // 거리 텍스트 설정
    const distance = Math.round(measurement);
    distanceRef.current.textContent = `${distance}px`;
    distanceRef.current.style.transform = 'translate(-50%, -50%)';
    distanceRef.current.style.display = 'block';
  };

  // 위쪽 간격 표시
  const showTopLine = (
    selectedRect: DOMRect,
    hoveredRect: DOMRect,
    isParentChild: boolean,
    selectedElement: HTMLElement,
    hoveredElement: HTMLElement,
  ) => {
    const isSelectedChildOfHovered = hoveredElement.contains(selectedElement);
    let startX, startY, endY, height;

    if (isParentChild) {
      startX =
        (isSelectedChildOfHovered
          ? selectedRect.left + selectedRect.width / 2
          : hoveredRect.left + hoveredRect.width / 2) + window.scrollX;
      startY = selectedRect.top + window.scrollY;
      endY = (isSelectedChildOfHovered ? hoveredRect.top : selectedRect.top) + window.scrollY;
      height = Math.abs(startY - endY);
    } else {
      startX = selectedRect.left + selectedRect.width / 2 + window.scrollX;
      startY = selectedRect.top + window.scrollY;
      endY = hoveredRect.bottom + window.scrollY;
      height = startY - endY;
    }

    setupLine('top', startX, startY, height, endY);
  };

  // 오른쪽 간격 표시
  const showRightLine = (
    selectedRect: DOMRect,
    hoveredRect: DOMRect,
    isParentChild: boolean,
    selectedElement: HTMLElement,
    hoveredElement: HTMLElement,
  ) => {
    const isSelectedChildOfHovered = hoveredElement.contains(selectedElement);
    let startX, startY, endX, width;

    if (isParentChild) {
      startX = selectedRect.right + window.scrollX;
      startY = selectedRect.top + selectedRect.height / 2 + window.scrollY;
      endX = (isSelectedChildOfHovered ? hoveredRect.right : selectedRect.right) + window.scrollX;
      width = Math.abs(endX - startX);
    } else {
      startX = selectedRect.right + window.scrollX;
      startY = selectedRect.top + selectedRect.height / 2 + window.scrollY;
      endX = hoveredRect.left + window.scrollX;
      width = endX - startX;
    }

    setupLine('right', startX, startY, width, endX);
  };

  // 아래쪽 간격 표시
  const showBottomLine = (
    selectedRect: DOMRect,
    hoveredRect: DOMRect,
    isParentChild: boolean,
    selectedElement: HTMLElement,
    hoveredElement: HTMLElement,
  ) => {
    const isSelectedChildOfHovered = hoveredElement.contains(selectedElement);
    let startX, startY, endY, height;

    if (isParentChild) {
      startX =
        (isSelectedChildOfHovered
          ? selectedRect.left + selectedRect.width / 2
          : hoveredRect.left + hoveredRect.width / 2) + window.scrollX;
      startY = selectedRect.bottom + window.scrollY;
      endY = (isSelectedChildOfHovered ? hoveredRect.bottom : selectedRect.bottom) + window.scrollY;
      height = Math.abs(endY - startY);
    } else {
      startX = selectedRect.left + selectedRect.width / 2 + window.scrollX;
      startY = selectedRect.bottom + window.scrollY;
      endY = hoveredRect.top + window.scrollY;
      height = endY - startY;
    }

    setupLine('bottom', startX, startY, height, endY);
  };

  // 왼쪽 간격 표시
  const showLeftLine = (
    selectedRect: DOMRect,
    hoveredRect: DOMRect,
    isParentChild: boolean,
    selectedElement: HTMLElement,
    hoveredElement: HTMLElement,
  ) => {
    const isSelectedChildOfHovered = hoveredElement.contains(selectedElement);
    let startX, startY, endX, width;

    if (isParentChild) {
      startX = selectedRect.left + window.scrollX;
      startY = selectedRect.top + selectedRect.height / 2 + window.scrollY;
      endX = (isSelectedChildOfHovered ? hoveredRect.left : selectedRect.left) + window.scrollX;
      width = Math.abs(startX - endX);
    } else {
      startX = selectedRect.left + window.scrollX;
      startY = selectedRect.top + selectedRect.height / 2 + window.scrollY;
      endX = hoveredRect.right + window.scrollX;
      width = startX - endX;
    }

    setupLine('left', startX, startY, width, endX);
  };

  // 모든 방향의 간격 표시 (부모-자식 관계인 경우)
  const showAllDirections = (
    selectedRect: DOMRect,
    hoveredRect: DOMRect,
    selectedElement: HTMLElement,
    hoveredElement: HTMLElement,
  ) => {
    // 상하좌우 모든 간격 표시
    showTopLine(selectedRect, hoveredRect, true, selectedElement, hoveredElement);
    showRightLine(selectedRect, hoveredRect, true, selectedElement, hoveredElement);
    showBottomLine(selectedRect, hoveredRect, true, selectedElement, hoveredElement);
    showLeftLine(selectedRect, hoveredRect, true, selectedElement, hoveredElement);
  };

  // 대각선 및 기타 방향의 간격 표시 (일반적인 경우)
  const showDiagonalDirections = (
    selectedRect: DOMRect,
    hoveredRect: DOMRect,
    selectedElement: HTMLElement,
    hoveredElement: HTMLElement,
  ) => {
    // 선택된 요소의 중심점
    const selectedCenter = {
      x: selectedRect.left + selectedRect.width / 2,
      y: selectedRect.top + selectedRect.height / 2,
    };

    // 호버된 요소의 중심점
    const hoveredCenter = {
      x: hoveredRect.left + hoveredRect.width / 2,
      y: hoveredRect.top + hoveredRect.height / 2,
    };

    // 위쪽 또는 아래쪽 방향 결정
    if (hoveredCenter.y < selectedCenter.y) {
      // 호버된 요소가 위쪽에 있는 경우
      showTopLine(selectedRect, hoveredRect, false, selectedElement, hoveredElement);
    } else if (hoveredCenter.y > selectedCenter.y) {
      // 호버된 요소가 아래쪽에 있는 경우
      showBottomLine(selectedRect, hoveredRect, false, selectedElement, hoveredElement);
    }

    // 왼쪽 또는 오른쪽 방향 결정
    if (hoveredCenter.x < selectedCenter.x) {
      // 호버된 요소가 왼쪽에 있는 경우
      showLeftLine(selectedRect, hoveredRect, false, selectedElement, hoveredElement);
    } else if (hoveredCenter.x > selectedCenter.x) {
      // 호버된 요소가 오른쪽에 있는 경우
      showRightLine(selectedRect, hoveredRect, false, selectedElement, hoveredElement);
    }
  };

  useEffect(() => {
    if (!selectedElement || !hoveredElement) {
      hideAllLines();
      return;
    }

    if (hoveredElement.id === ELEMENT_ID.ROOT) {
      hideAllLines();
      return;
    }

    if (selectedElement === hoveredElement) {
      hideAllLines();
      return;
    }

    const selectedRect = selectedElement.getBoundingClientRect();
    const hoveredRect = hoveredElement.getBoundingClientRect();

    // 요소 간의 관계 확인
    const isParentChild = isParentChildRelationship(selectedElement, hoveredElement);

    // 모든 선 숨기기
    hideAllLines();

    if (isParentChild) {
      // 부모-자식 관계인 경우 모든 방향의 간격 표시
      showAllDirections(selectedRect, hoveredRect, selectedElement, hoveredElement);
    } else {
      // 일반적인 경우 적절한 방향의 간격 표시
      showDiagonalDirections(selectedRect, hoveredRect, selectedElement, hoveredElement);
    }
  }, [selectedElement, hoveredElement]);

  // 스타일링 클래스 정의
  const lineClassName = 'absolute pointer-events-none border-[1px] border-dashed border-gray-400 hidden';
  const distanceClassName =
    'absolute pointer-events-none z-[99998] bg-main-900 text-white px-1.5 py-0.5 rounded text-xs font-mono hidden text-[10px]';

  return (
    <>
      {/* 각 방향의 점선 */}
      {Object.entries(lineConfigs).map(([direction, config]) => (
        <div
          key={`${direction}-line`}
          ref={config.ref}
          className={cn(lineClassName, config.cssProps, Z_INDEX.SPACING_GUIDE_LINE)}
          id={`${ELEMENT_ID.SELECTED_HIGHLIGHT_OVERLAY}-${direction}-line`}
          style={{
            zIndex: Z_INDEX.SPACING_GUIDE_LINE,
          }}
        />
      ))}

      {/* 각 방향의 거리 표시 */}
      {Object.entries(lineConfigs).map(([direction, config]) => (
        <div
          key={`${direction}-distance`}
          ref={config.distanceRef}
          className={cn(distanceClassName, Z_INDEX.SPACING_GUIDE_LINE)}
          id={`${ELEMENT_ID.SELECTED_HIGHLIGHT_OVERLAY}-${direction}-distance`}
        />
      ))}
    </>
  );
}
