import { useEffect, useRef } from 'react';
import { useElementScanStore } from '@extension/shared';
import { useShallow } from 'zustand/shallow';
import { ELEMENT_ID, Z_INDEX } from '@src/constants';
import { cn } from '@extension/ui';

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
      // 일반적인 경우 가장 가까운 방향의 간격만 표시
      showNearestDirection(selectedRect, hoveredRect, selectedElement, hoveredElement);
    }
  }, [selectedElement, hoveredElement]);

  // 부모-자식 관계 확인
  const isParentChildRelationship = (element1: HTMLElement, element2: HTMLElement): boolean => {
    // 클릭된 요소가 호버된 요소의 자식인지 확인
    return element2.contains(element1) || element1.contains(element2);
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

  // 가장 가까운 방향의 간격만 표시 (일반적인 경우)
  const showNearestDirection = (
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

    // 방향 결정 (상, 우, 하, 좌)
    const diffX = hoveredCenter.x - selectedCenter.x;
    const diffY = hoveredCenter.y - selectedCenter.y;
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    if (absX > absY) {
      // 좌우 방향이 우세
      if (diffX > 0) {
        // 오른쪽 방향
        showRightLine(selectedRect, hoveredRect, false, selectedElement, hoveredElement);
      } else {
        // 왼쪽 방향
        showLeftLine(selectedRect, hoveredRect, false, selectedElement, hoveredElement);
      }
    } else {
      // 상하 방향이 우세
      if (diffY > 0) {
        // 아래쪽 방향
        showBottomLine(selectedRect, hoveredRect, false, selectedElement, hoveredElement);
      } else {
        // 위쪽 방향
        showTopLine(selectedRect, hoveredRect, false, selectedElement, hoveredElement);
      }
    }
  };

  // 모든 선 숨기기
  const hideAllLines = () => {
    [topLineRef, rightLineRef, bottomLineRef, leftLineRef].forEach(ref => {
      if (ref.current) {
        ref.current.style.display = 'none';
      }
    });

    // 모든 거리 표시 요소도 숨기기
    [topDistanceRef, rightDistanceRef, bottomDistanceRef, leftDistanceRef].forEach(ref => {
      if (ref.current) {
        ref.current.style.display = 'none';
      }
    });
  };

  // 위쪽 간격 표시
  const showTopLine = (
    selectedRect: DOMRect,
    hoveredRect: DOMRect,
    isParentChild: boolean,
    selectedElement: HTMLElement,
    hoveredElement: HTMLElement,
  ) => {
    if (!topLineRef.current || !topDistanceRef.current) return;

    let startX, startY, endY, height;

    if (isParentChild) {
      // 부모-자식 관계의 경우, 자식 요소 상단에서 부모 요소 상단까지의 간격
      const isSelectedChildOfHovered = hoveredElement.contains(selectedElement);

      if (isSelectedChildOfHovered) {
        // 호버된 요소가 부모인 경우
        startX = selectedRect.left + selectedRect.width / 2 + window.scrollX;
        startY = selectedRect.top + window.scrollY;
        endY = hoveredRect.top + window.scrollY;
      } else {
        // 선택된 요소가 부모인 경우
        startX = hoveredRect.left + hoveredRect.width / 2 + window.scrollX;
        startY = hoveredRect.top + window.scrollY;
        endY = selectedRect.top + window.scrollY;
      }
      height = Math.abs(startY - endY);
    } else {
      // 일반적인 경우
      startX = selectedRect.left + selectedRect.width / 2 + window.scrollX;
      startY = selectedRect.top + window.scrollY;
      endY = hoveredRect.bottom + window.scrollY;
      height = startY - endY;
    }

    if (height <= 0) return; // 유효하지 않은 높이는 무시

    // 시작점과 끝점 중 위쪽인 지점에서 선이 시작되도록 설정
    const topY = Math.min(startY, endY);
    topLineRef.current.style.left = `${startX}px`;
    topLineRef.current.style.top = `${topY}px`;
    topLineRef.current.style.height = `${height}px`;
    topLineRef.current.style.display = 'block';

    // 거리 표시 (중간 지점에 배치)
    const distance = Math.round(height);
    const middleY = topY + height / 2;

    topDistanceRef.current.textContent = `${distance}px`;
    topDistanceRef.current.style.left = `${startX + 10}px`; // 선에서 약간 오른쪽으로 띄움
    topDistanceRef.current.style.top = `${middleY - 10}px`; // 중앙에 배치하되 약간 위로 조정
    topDistanceRef.current.style.display = 'block';
  };

  // 오른쪽 간격 표시
  const showRightLine = (
    selectedRect: DOMRect,
    hoveredRect: DOMRect,
    isParentChild: boolean,
    selectedElement: HTMLElement,
    hoveredElement: HTMLElement,
  ) => {
    if (!rightLineRef.current || !rightDistanceRef.current) return;

    let startX, startY, endX, width;

    if (isParentChild) {
      // 부모-자식 관계의 경우, 자식 요소 오른쪽에서 부모 요소 오른쪽까지의 간격
      const isSelectedChildOfHovered = hoveredElement.contains(selectedElement);

      if (isSelectedChildOfHovered) {
        // 호버된 요소가 부모인 경우
        startX = selectedRect.right + window.scrollX;
        startY = selectedRect.top + selectedRect.height / 2 + window.scrollY;
        endX = hoveredRect.right + window.scrollX;
      } else {
        // 선택된 요소가 부모인 경우
        startX = hoveredRect.right + window.scrollX;
        startY = hoveredRect.top + hoveredRect.height / 2 + window.scrollY;
        endX = selectedRect.right + window.scrollX;
      }
      width = Math.abs(endX - startX);
    } else {
      // 일반적인 경우
      startX = selectedRect.right + window.scrollX;
      startY = selectedRect.top + selectedRect.height / 2 + window.scrollY;
      endX = hoveredRect.left + window.scrollX;
      width = endX - startX;
    }

    if (width <= 0) return; // 유효하지 않은 너비는 무시

    // 시작점과 끝점 중 왼쪽인 지점에서 선이 시작되도록 설정
    const leftX = Math.min(startX, endX);
    rightLineRef.current.style.left = `${leftX}px`;
    rightLineRef.current.style.top = `${startY}px`;
    rightLineRef.current.style.width = `${width}px`;
    rightLineRef.current.style.display = 'block';

    // 거리 표시 (중간 지점에 배치)
    const distance = Math.round(width);
    const middleX = leftX + width / 2;

    rightDistanceRef.current.textContent = `${distance}px`;
    rightDistanceRef.current.style.left = `${middleX - 20}px`; // 중앙에 배치하되 약간 왼쪽으로 조정
    rightDistanceRef.current.style.top = `${startY - 25}px`; // 선 위에 배치
    rightDistanceRef.current.style.display = 'block';
  };

  // 아래쪽 간격 표시
  const showBottomLine = (
    selectedRect: DOMRect,
    hoveredRect: DOMRect,
    isParentChild: boolean,
    selectedElement: HTMLElement,
    hoveredElement: HTMLElement,
  ) => {
    if (!bottomLineRef.current || !bottomDistanceRef.current) return;

    let startX, startY, endY, height;

    if (isParentChild) {
      // 부모-자식 관계의 경우, 자식 요소 하단에서 부모 요소 하단까지의 간격
      const isSelectedChildOfHovered = hoveredElement.contains(selectedElement);

      if (isSelectedChildOfHovered) {
        // 호버된 요소가 부모인 경우
        startX = selectedRect.left + selectedRect.width / 2 + window.scrollX;
        startY = selectedRect.bottom + window.scrollY;
        endY = hoveredRect.bottom + window.scrollY;
      } else {
        // 선택된 요소가 부모인 경우
        startX = hoveredRect.left + hoveredRect.width / 2 + window.scrollX;
        startY = hoveredRect.bottom + window.scrollY;
        endY = selectedRect.bottom + window.scrollY;
      }
      height = Math.abs(endY - startY);
    } else {
      // 일반적인 경우
      startX = selectedRect.left + selectedRect.width / 2 + window.scrollX;
      startY = selectedRect.bottom + window.scrollY;
      endY = hoveredRect.top + window.scrollY;
      height = endY - startY;
    }

    if (height <= 0) return; // 유효하지 않은 높이는 무시

    // 시작점과 끝점 중 위쪽인 지점에서 선이 시작되도록 설정
    const topY = Math.min(startY, endY);
    bottomLineRef.current.style.left = `${startX}px`;
    bottomLineRef.current.style.top = `${topY}px`;
    bottomLineRef.current.style.height = `${height}px`;
    bottomLineRef.current.style.display = 'block';

    // 거리 표시 (중간 지점에 배치)
    const distance = Math.round(height);
    const middleY = topY + height / 2;

    bottomDistanceRef.current.textContent = `${distance}px`;
    bottomDistanceRef.current.style.left = `${startX + 10}px`; // 선에서 약간 오른쪽으로 띄움
    bottomDistanceRef.current.style.top = `${middleY - 10}px`; // 중앙에 배치하되 약간 위로 조정
    bottomDistanceRef.current.style.display = 'block';
  };

  // 왼쪽 간격 표시
  const showLeftLine = (
    selectedRect: DOMRect,
    hoveredRect: DOMRect,
    isParentChild: boolean,
    selectedElement: HTMLElement,
    hoveredElement: HTMLElement,
  ) => {
    if (!leftLineRef.current || !leftDistanceRef.current) return;

    let startX, startY, endX, width;

    if (isParentChild) {
      // 부모-자식 관계의 경우, 자식 요소 왼쪽에서 부모 요소 왼쪽까지의 간격
      const isSelectedChildOfHovered = hoveredElement.contains(selectedElement);

      if (isSelectedChildOfHovered) {
        // 호버된 요소가 부모인 경우
        startX = selectedRect.left + window.scrollX;
        startY = selectedRect.top + selectedRect.height / 2 + window.scrollY;
        endX = hoveredRect.left + window.scrollX;
      } else {
        // 선택된 요소가 부모인 경우
        startX = hoveredRect.left + window.scrollX;
        startY = hoveredRect.top + hoveredRect.height / 2 + window.scrollY;
        endX = selectedRect.left + window.scrollX;
      }
      width = Math.abs(startX - endX);
    } else {
      // 일반적인 경우
      startX = selectedRect.left + window.scrollX;
      startY = selectedRect.top + selectedRect.height / 2 + window.scrollY;
      endX = hoveredRect.right + window.scrollX;
      width = startX - endX;
    }

    if (width <= 0) return; // 유효하지 않은 너비는 무시

    // 시작점과 끝점 중 왼쪽인 지점에서 선이 시작되도록 설정
    const leftX = Math.min(startX, endX);
    leftLineRef.current.style.left = `${leftX}px`;
    leftLineRef.current.style.top = `${startY}px`;
    leftLineRef.current.style.width = `${width}px`;
    leftLineRef.current.style.display = 'block';

    // 거리 표시 (중간 지점에 배치)
    const distance = Math.round(width);
    const middleX = leftX + width / 2;

    leftDistanceRef.current.textContent = `${distance}px`;
    leftDistanceRef.current.style.left = `${middleX - 20}px`; // 중앙에 배치하되 약간 왼쪽으로 조정
    leftDistanceRef.current.style.top = `${startY - 25}px`; // 선 위에 배치
    leftDistanceRef.current.style.display = 'block';
  };

  const lineClassName = 'absolute pointer-events-none z-[99997] border-2 border-dashed border-sub-500 hidden';
  const distanceClassName =
    'absolute pointer-events-none z-[99998] bg-sub-500 text-white px-2 py-0.5 rounded text-xs font-mono hidden';

  return (
    <>
      {/* 각 방향의 점선 */}
      <div
        ref={topLineRef}
        className={cn(lineClassName, 'w-0', Z_INDEX.SPACING_GUIDE_LINE)}
        id={`${ELEMENT_ID.SELECTED_HIGHLIGHT_OVERLAY}-top-line`}
      />
      <div
        ref={rightLineRef}
        className={cn(lineClassName, 'h-0', Z_INDEX.SPACING_GUIDE_LINE)}
        id={`${ELEMENT_ID.SELECTED_HIGHLIGHT_OVERLAY}-right-line`}
      />
      <div
        ref={bottomLineRef}
        className={cn(lineClassName, 'w-0', Z_INDEX.SPACING_GUIDE_LINE)}
        id={`${ELEMENT_ID.SELECTED_HIGHLIGHT_OVERLAY}-bottom-line`}
      />
      <div
        ref={leftLineRef}
        className={cn(lineClassName, 'h-0', Z_INDEX.SPACING_GUIDE_LINE)}
        id={`${ELEMENT_ID.SELECTED_HIGHLIGHT_OVERLAY}-left-line`}
      />

      {/* 각 방향의 거리 표시 */}
      <div
        ref={topDistanceRef}
        className={cn(distanceClassName, Z_INDEX.SPACING_GUIDE_LINE)}
        id={`${ELEMENT_ID.SELECTED_HIGHLIGHT_OVERLAY}-top-distance`}
      />
      <div
        ref={rightDistanceRef}
        className={cn(distanceClassName, Z_INDEX.SPACING_GUIDE_LINE)}
        id={`${ELEMENT_ID.SELECTED_HIGHLIGHT_OVERLAY}-right-distance`}
      />
      <div
        ref={bottomDistanceRef}
        className={cn(distanceClassName, Z_INDEX.SPACING_GUIDE_LINE)}
        id={`${ELEMENT_ID.SELECTED_HIGHLIGHT_OVERLAY}-bottom-distance`}
      />
      <div
        ref={leftDistanceRef}
        className={cn(distanceClassName, Z_INDEX.SPACING_GUIDE_LINE)}
        id={`${ELEMENT_ID.SELECTED_HIGHLIGHT_OVERLAY}-left-distance`}
      />
    </>
  );
}
