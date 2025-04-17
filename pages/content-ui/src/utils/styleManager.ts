import { type StyleManagerInterface, type StyleGroup, type StyleGroupMap } from '../types';
import { colorManager } from './colorManager';

/**
 * CSS 규칙 타입 정의
 */
interface CssRule {
  property: string;
  value: string;
  success: boolean;
}

/**
 * 스타일 관련 기능을 담당하는 서비스 클래스
 */
export class StyleManager implements StyleManagerInterface {
  // 중요한 CSS 속성 그룹
  public readonly STYLE_GROUPS: Record<string, string[]> = {
    Layout: ['display', 'position', 'top', 'right', 'bottom', 'left', 'width', 'height', 'margin', 'padding', 'border'],
    Typography: ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-align', 'color'],
    Visual: ['background-color', 'background-image', 'opacity', 'box-shadow', 'border-radius'],
    Flexbox: ['flex-direction', 'justify-content', 'align-items', 'flex-wrap', 'gap'],
  };

  /**
   * 속성이 어떤 스타일 그룹에 속하는지 확인
   * @param property CSS 속성
   * @returns 스타일 그룹 이름 또는 'Miscellaneous'
   */
  public getPropertyGroup(property: string): string {
    for (const [groupName, properties] of Object.entries(this.STYLE_GROUPS)) {
      if (properties.some(p => property.startsWith(p))) {
        return groupName;
      }
    }
    return 'Miscellaneous';
  }

  /**
   * 요소의 계산된 스타일 가져오기
   * @param element 대상 HTML 요소
   * @returns 스타일 그룹별로 정리된 CSS 속성-값 맵
   */
  public getComputedStylesForElement(element: HTMLElement): StyleGroupMap {
    // 기본 스타일 그룹 초기화
    const styles: StyleGroupMap = {
      Layout: {},
      Typography: {},
      Visual: {},
      Flexbox: {},
    };

    try {
      // computedStyle은 항상 가져올 수 있어야 함
      const computedStyle = window.getComputedStyle(element);

      // 사용자가 정의한 스타일 규칙 찾기 (오류가 발생해도 빈 배열 반환)
      let userDefinedStyles: string[] = [];
      try {
        userDefinedStyles = this.getUserDefinedStyles(element);
      } catch (stylesError) {
        console.debug('사용자 정의 스타일 추출 오류:', stylesError);
        // 오류 발생 시 기본 스타일 속성 사용
        userDefinedStyles = [
          'display',
          'width',
          'height',
          'color',
          'margin',
          'padding',
          'font-size',
          'position',
          'background-color',
          'font-weight',
        ];
      }

      // 그룹별로 스타일 정보 수집
      for (const [groupName, properties] of Object.entries(this.STYLE_GROUPS)) {
        for (const prop of properties) {
          // 사용자 정의 스타일인 경우에만 표시
          if (userDefinedStyles.includes(prop)) {
            let exactValue = computedStyle.getPropertyValue(prop);
            if (exactValue && exactValue !== '') {
              // 색상 값이면 HEX로 변환
              if (colorManager.isColorProperty(prop) && exactValue.includes('rgb')) {
                exactValue = colorManager.rgbToHex(exactValue);
              }
              styles[groupName][prop] = exactValue;
            }
          } else {
            // 축약형 속성 체크 (margin-top, padding-left 등)
            const subProperties = ['top', 'right', 'bottom', 'left'].map(side => `${prop}-${side}`);
            for (const subProp of subProperties) {
              if (userDefinedStyles.includes(subProp)) {
                let value = computedStyle.getPropertyValue(subProp);
                if (value && value !== '') {
                  // 색상 값이면 HEX로 변환
                  if (colorManager.isColorProperty(subProp) && value.includes('rgb')) {
                    value = colorManager.rgbToHex(value);
                  }
                  styles[groupName][subProp] = value;
                }
              }
            }
          }
        }
      }

      // 인라인 스타일 추가
      this.addInlineStyles(element, styles);

      return styles;
    } catch (e) {
      console.error('스타일 계산 중 오류:', e);
      return this.getFallbackStyles(element);
    }
  }

  /**
   * 인라인 스타일을 스타일 그룹에 추가
   * @param element 대상 HTML 요소
   * @param styles 스타일 그룹 객체
   */
  private addInlineStyles(element: HTMLElement, styles: StyleGroupMap): void {
    if (element.hasAttribute('style')) {
      const inlineStyle = element.getAttribute('style') || '';
      const inlineProperties = inlineStyle.split(';').filter(Boolean);

      for (const prop of inlineProperties) {
        const parts = prop.split(':');
        if (parts.length >= 2) {
          const property = parts[0].trim();
          const value = parts.slice(1).join(':').trim(); // 콜론을 포함할 수 있는 값 처리

          if (property && value) {
            // 색상 값이면 HEX로 변환
            let finalValue = value;
            if (colorManager.isColorProperty(property) && value.includes('rgb')) {
              finalValue = colorManager.rgbToHex(value);
            }

            // 속성이 속한 그룹 찾기
            const groupName = this.getPropertyGroup(property);
            styles[groupName] = styles[groupName] || {};
            styles[groupName][property] = finalValue;
          }
        }
      }
    }
  }

  /**
   * 오류 발생 시 기본 스타일 정보 반환
   * @param element 대상 HTML 요소
   * @returns 기본 스타일 정보
   */
  private getFallbackStyles(element: HTMLElement): StyleGroupMap {
    const fallbackStyles: StyleGroupMap = {
      Layout: {
        'element-type': element.tagName.toLowerCase(),
      },
      Typography: {},
      Visual: {},
      Flexbox: {},
    };

    try {
      if (element.id) {
        fallbackStyles.Layout['id'] = `#${element.id}`;
      }

      if (element.className && typeof element.className === 'string') {
        const firstClassName = element.className.split(' ')[0];
        if (firstClassName) {
          fallbackStyles.Layout['class'] = `.${firstClassName}`;
        }
      }

      const rect = element.getBoundingClientRect();
      fallbackStyles.Layout['width'] = `${Math.round(rect.width)}px`;
      fallbackStyles.Layout['height'] = `${Math.round(rect.height)}px`;
    } catch (error) {
      console.error('기본 스타일 생성 오류:', error);
    }

    return fallbackStyles;
  }

  /**
   * 사용자가 정의한 스타일 규칙 찾기
   * @param element 대상 HTML 요소
   * @returns 사용자가 정의한 CSS 속성 배열
   */
  public getUserDefinedStyles(element: HTMLElement): string[] {
    const userStyles: string[] = [];
    const addedProperties = new Set<string>(); // 중복 방지를 위한 Set

    // 속성 추가 도우미 함수
    const addProperty = (prop: string) => {
      const property = prop.trim();
      if (property && !addedProperties.has(property)) {
        userStyles.push(property);
        addedProperties.add(property);
      }
    };

    // 1. 인라인 스타일 체크 (우선 순위가 가장 높음)
    if (element.hasAttribute('style')) {
      const inlineStyle = element.getAttribute('style') || '';
      const inlineProperties = inlineStyle.split(';').filter(Boolean);

      for (const prop of inlineProperties) {
        const parts = prop.split(':');
        if (parts.length >= 1) {
          addProperty(parts[0]);
        }
      }
    }

    // 2. 문서의 모든 스타일시트에서 해당 요소에 적용된 규칙 찾기
    try {
      const matchedCSSRules = this.getMatchedCSSRules(element);

      for (const rule of matchedCSSRules) {
        try {
          const cssText = rule.cssText || rule.style.cssText;
          if (cssText) {
            // CSSRule.cssText에서 스타일 부분만 추출
            let styleText = '';
            try {
              styleText = cssText.substring(cssText.indexOf('{') + 1, cssText.lastIndexOf('}'));
            } catch (parseError) {
              // cssText 파싱 오류 시 style 객체에서 직접 추출 시도
              for (let i = 0; i < rule.style.length; i++) {
                const propName = rule.style[i];
                if (propName) {
                  addProperty(propName);
                }
              }
              continue;
            }

            const styleProperties = styleText.split(';');

            for (const styleProp of styleProperties) {
              const parts = styleProp.split(':');
              if (parts.length >= 1) {
                addProperty(parts[0]);
              }
            }
          } else if (rule.style) {
            // cssText가 없는 경우 style 객체에서 직접 속성 이름 추출
            for (let i = 0; i < rule.style.length; i++) {
              const propName = rule.style[i];
              if (propName) {
                addProperty(propName);
              }
            }
          }
        } catch (ruleError) {
          console.debug('규칙 파싱 오류 (무시됨):', ruleError);
          continue;
        }
      }
    } catch (e) {
      console.error('스타일시트 분석 오류:', e);
    }

    // 기본 스타일 속성은 강제로 추가하지 않음 (사용자가 실제로 정의한 CSS 속성만 표시)

    return userStyles;
  }

  /**
   * 요소에 적용된 CSS 규칙 가져오기
   * @param element 대상 HTML 요소
   * @returns 요소에 적용된 CSSStyleRule 배열
   */
  public getMatchedCSSRules(element: HTMLElement): CSSStyleRule[] {
    const matchedRules: CSSStyleRule[] = [];

    try {
      // 모든 스타일시트 순회
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          const rules = sheet.cssRules || sheet.rules;
          if (!rules) continue;

          for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];

            // CSSStyleRule인 경우만 처리 (type === 1은 STYLE_RULE을 의미)
            if (rule.type !== CSSRule.STYLE_RULE && rule.type !== 1) continue;
          }
        } catch (e) {
          // CORS 제한으로 인한 오류는 무시 (외부 스타일시트)
          console.debug('스타일시트 접근 오류 (무시됨):', e);
          continue;
        }
      }
    } catch (e) {
      console.error('스타일 규칙 매칭 오류:', e);
    }

    return matchedRules;
  }

  /**
   * CSS 텍스트를 파싱하여 속성-값 쌍의 배열로 변환
   * @param cssText CSS 문자열
   * @returns CSS 규칙 배열
   */
  private parseCssText(cssText: string): CssRule[] {
    const result: CssRule[] = [];

    // 여러 줄로 분리
    const lines = cssText.split('\n');

    let currentProperty = '';
    let currentValue = '';
    let insideMultilineValue = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // 빈 줄 또는 주석은 무시
      if (line === '' || line.startsWith('//') || line.startsWith('/*')) {
        continue;
      }

      if (!insideMultilineValue) {
        // 새로운 속성-값 쌍 찾기
        const colonIndex = line.indexOf(':');

        if (colonIndex > 0) {
          // 속성과 값 추출
          currentProperty = line.substring(0, colonIndex).trim();
          currentValue = line.substring(colonIndex + 1).trim();

          // 닫는 세미콜론이 있는지 확인
          if (currentValue.endsWith(';')) {
            currentValue = currentValue.slice(0, -1).trim();

            // 유효한 속성-값 쌍이면 결과에 추가
            if (currentProperty && currentValue) {
              result.push({
                property: currentProperty,
                value: currentValue,
                success: true,
              });
            }

            // 상태 초기화
            currentProperty = '';
            currentValue = '';
          } else {
            // 세미콜론이 없으면 다중 라인 값일 수 있음
            insideMultilineValue = true;
          }
        }
      } else {
        // 다중 라인 값 처리
        currentValue += ' ' + line;

        // 닫는 세미콜론이 있는지 확인
        if (line.endsWith(';')) {
          currentValue = currentValue.slice(0, -1).trim();

          // 유효한 속성-값 쌍이면 결과에 추가
          if (currentProperty && currentValue) {
            result.push({
              property: currentProperty,
              value: currentValue,
              success: true,
            });
          }

          // 상태 초기화
          insideMultilineValue = false;
          currentProperty = '';
          currentValue = '';
        }
      }
    }

    // 마지막 속성-값 쌍 처리 (세미콜론 없이 끝날 경우)
    if (currentProperty && currentValue) {
      result.push({
        property: currentProperty,
        value: currentValue,
        success: true,
      });
    }

    return result;
  }

  /**
   * 요소에 스타일 적용
   * @param element 스타일을 적용할 HTML 요소
   * @param property CSS 속성
   * @param value CSS 값
   * @returns 적용 성공 여부
   */
  public applyStyle(element: HTMLElement, property: string, value: string): boolean {
    if (!element || !property || value === undefined) {
      return false;
    }

    try {
      // 속성명이 camelCase인 경우 변환
      const cssProperty = property.includes('-') ? property : this.convertToCamelCase(property);

      // 요소에 스타일 적용
      element.style[cssProperty as any] = value;

      return true;
    } catch (error) {
      console.error(`스타일 적용 오류 (${property}: ${value}):`, error);
      return false;
    }
  }

  /**
   * 대량 CSS 적용
   * @param element 대상 HTML 요소
   * @param cssText CSS 문자열
   * @returns 적용 결과 및 상세 정보
   */
  public applyBulkCss(
    element: HTMLElement,
    cssText: string,
  ): {
    success: boolean;
    results: Array<{ property: string; value: string; success: boolean }>;
  } {
    if (!element) {
      console.warn('CSS 적용 실패: 선택된 요소가 없습니다.');
      return { success: false, results: [] };
    }

    // CSS 텍스트에서 각각의 속성:값 쌍을 추출
    const cssRules = this.parseCssText(cssText);

    if (cssRules.length === 0) {
      console.warn('유효한 CSS 규칙이 없습니다.');
      return { success: false, results: [] };
    }

    const results: Array<{
      property: string;
      value: string;
      success: boolean;
    }> = [];
    let successCount = 0;

    for (const rule of cssRules) {
      try {
        const { property, value } = rule;

        if (property && value) {
          // 인라인 스타일로 적용
          const camelCaseProperty = property.includes('-') ? this.convertToCamelCase(property) : property;

          // 인라인 스타일로 적용
          element.style[camelCaseProperty as any] = value;

          // 값이 적용되었는지 확인
          const appliedValue = element.style[camelCaseProperty as any];
          const success = appliedValue !== '';

          // 결과 저장
          results.push({ property, value, success });

          // 성공 로그 출력
          if (success) {
            successCount++;
          } else {
            console.warn(`CSS 속성 적용 실패: ${property}: ${value}`);
          }
        }
      } catch (error) {
        console.error(`CSS 적용 중 오류 발생: ${rule.property}: ${rule.value}`, error);
        results.push({
          property: rule.property,
          value: rule.value,
          success: false,
        });
      }
    }

    return { success: successCount > 0, results };
  }

  /**
   * 요소에 스타일 직접 적용 (유틸리티 메서드)
   * @param element 스타일을 적용할 HTML 요소
   * @param property CSS 속성
   * @param value CSS 값
   */
  public applyStyleToElement(element: HTMLElement, property: string, value: string): void {
    if (!element || !property) return;

    try {
      // 속성명이 camelCase인 경우 변환
      const cssProperty = property.includes('-') ? this.convertToCamelCase(property) : property;

      // 요소에 스타일 적용
      element.style[cssProperty as any] = value;
    } catch (error) {
      console.error(`스타일 직접 적용 오류 (${property}: ${value}):`, error);
    }
  }

  /**
   * 스타일을 클립보드에 복사
   * @param styles 복사할 스타일 그룹
   * @returns 복사 성공 여부
   */
  public async copyStylesToClipboard(styles: StyleGroupMap): Promise<boolean> {
    try {
      // 스타일 객체를 CSS 텍스트로 변환
      let cssText = '';

      // 각 스타일 그룹 순회
      for (const [groupName, properties] of Object.entries(styles as Record<string, StyleGroup>)) {
        // 그룹 헤더 주석 추가
        if (Object.keys(properties).length > 0) {
          cssText += `/* ${groupName} */\n`;

          // 각 속성 추가
          for (const [property, value] of Object.entries(properties as Record<string, string>)) {
            cssText += `${property}: ${value};\n`;
          }

          cssText += '\n';
        }
      }

      // 클립보드에 복사
      if (cssText) {
        await navigator.clipboard.writeText(cssText.trim());
        return true;
      }

      return false;
    } catch (error) {
      console.error('스타일 복사 오류:', error);

      // fallback: 텍스트 영역 요소를 사용한 복사 시도
      try {
        let cssText = '';
        for (const [_, properties] of Object.entries(styles as Record<string, StyleGroup>)) {
          for (const [property, value] of Object.entries(properties as Record<string, string>)) {
            cssText += `${property}: ${value};\n`;
          }
        }

        const textArea = document.createElement('textarea');
        textArea.value = cssText.trim();
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
      } catch (fallbackError) {
        console.error('스타일 복사 대체 방법 오류:', fallbackError);
        return false;
      }
    }
  }

  /**
   * 대시 포함 CSS 속성명을 camelCase로 변환
   * @param property CSS 속성명
   * @returns camelCase로 변환된 CSS 속성명
   */
  public convertToCamelCase(property: string): string {
    return property.replace(/-([a-z])/g, (match, letter) => {
      return letter.toUpperCase();
    });
  }
}

export const styleManager = new StyleManager();
