/**
 * CSS 스캔 도구의 타입 정의
 */

// 스타일 그룹 인터페이스
export interface StyleGroup {
  [property: string]: string;
}

// 스타일 그룹 맵 인터페이스
export interface StyleGroupMap {
  [groupName: string]: StyleGroup;
}

// StyleGroups 타입 (StyleGroupMap과 동일, 하위 호환성 유지)
export type StyleGroups = StyleGroupMap;

// 스타일 서비스 인터페이스
export interface StyleManagerInterface {
  getComputedStylesForElement(element: HTMLElement): StyleGroupMap;
  applyStyle(element: HTMLElement, property: string, value: string): boolean;
  applyBulkCss(
    element: HTMLElement,
    cssText: string,
  ): {
    success: boolean;
    results: Array<{ property: string; value: string; success: boolean }>;
  };
  copyStylesToClipboard(styles: StyleGroupMap): Promise<boolean>;
  applyStyleToElement(element: HTMLElement, property: string, value: string): void;
  convertToCamelCase(property: string): string;
}
