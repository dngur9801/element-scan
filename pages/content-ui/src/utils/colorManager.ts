export interface ColorManagerInterface {
  rgbToHex(rgb: string): string;
  isValidColorValue(value: string): boolean;
  extractColorFromValue(value: string): string | null;
}

/**
 * 색상 관련 기능을 처리하는 서비스 클래스
 */
class ColorManager implements ColorManagerInterface {
  // 색상 관련 속성 목록
  public readonly COLOR_PROPERTIES = [
    'color',
    'background-color',
    'border-color',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'outline-color',
  ];

  /**
   * 속성이 색상 속성인지 확인
   * @param property CSS 속성
   * @returns 색상 속성 여부
   */
  public isColorProperty(property: string): boolean {
    return this.COLOR_PROPERTIES.some(colorProp => property.includes(colorProp));
  }

  /**
   * RGB 색상을 HEX 색상으로 변환하는 함수
   * @param rgb RGB 또는 RGBA 색상 문자열
   * @returns HEX 색상 문자열 또는 원래 값
   */
  public rgbToHex(rgb: string): string {
    // rgb(255, 255, 255) 또는 rgba(255, 255, 255, 1) 형식 확인
    if (!rgb || typeof rgb !== 'string') return rgb;

    // rgb/rgba 값인지 확인
    const rgbRegex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)/i;
    const match = rgb.match(rgbRegex);

    if (!match) return rgb; // RGB 형식이 아니면 원래 값 반환

    // RGB 값 추출 및 HEX 변환
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

    // RGB -> HEX 변환
    const toHex = (c: number): string => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    const hex = '#' + toHex(r) + toHex(g) + toHex(b);

    // 투명도가 1이 아니면 HEX에 알파 채널 추가 (CSS4 hex 색상 형식)
    if (a !== 1 && a !== undefined) {
      const alpha = Math.round(a * 255);
      return hex + toHex(alpha);
    }

    return hex;
  }

  /**
   * 값이 유효한 색상 값인지 확인
   * @param value CSS 값
   * @returns 유효한 색상 값 여부
   */
  public isValidColorValue(value: string): boolean {
    if (!value || typeof value !== 'string') return false;

    return (
      value.startsWith('#') ||
      value.startsWith('rgb') ||
      value.startsWith('rgba') ||
      value.startsWith('hsl') ||
      value.startsWith('hsla')
    );
  }

  /**
   * 값에서 색상 부분 추출
   * @param value CSS 값
   * @returns 추출된 색상 또는 null
   */
  public extractColorFromValue(value: string): string | null {
    if (!value || typeof value !== 'string') return null;

    // 순수 색상값이면 그대로 반환
    if (this.isValidColorValue(value)) return value;

    // 복합값에서 색상 부분 추출
    const colorMatch = value.match(/#[0-9a-f]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)/i);

    return colorMatch ? colorMatch[0] : null;
  }
}

export const colorManager = new ColorManager();
