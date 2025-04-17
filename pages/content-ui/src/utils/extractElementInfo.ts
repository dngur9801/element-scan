import type { ElementInfo, StyleGroup } from '../../../../packages/shared/lib/types';

function getUserDefinedStyles(element: HTMLElement): Record<string, string> {
  const definedStyles: Record<string, string> = {};
  console.log('document.styleSheets', document.styleSheets);

  // 모든 스타일시트 순회
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const rules: CSSRuleList = sheet.cssRules || sheet.rules;

      for (const rule of Array.from(rules)) {
        if (rule instanceof CSSStyleRule && rule.selectorText && element.matches(rule.selectorText)) {
          // 이 규칙이 현재 엘리먼트에 적용됨
          const styleDeclaration: CSSStyleDeclaration = rule.style;

          for (let i = 0; i < styleDeclaration.length; i++) {
            const propertyName: string = styleDeclaration[i];
            definedStyles[propertyName] = styleDeclaration.getPropertyValue(propertyName);
          }
        }
      }
    } catch (e) {
      console.warn('스타일시트에 접근할 수 없습니다:', e);
    }
  }

  // 인라인 스타일 추가
  const inlineStyle: CSSStyleDeclaration = element.style;
  for (let i = 0; i < inlineStyle.length; i++) {
    const propertyName: string = inlineStyle[i];
    definedStyles[propertyName] = inlineStyle.getPropertyValue(propertyName);
  }

  console.log('definedStyles', definedStyles);

  return definedStyles;
}

// 스타일 속성을 그룹으로 분류하는 함수
function categorizeStyles(styles: Record<string, string>): StyleGroup[] {
  // 그룹별 속성 분류 정의
  const layoutProperties = [
    'width',
    'height',
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'padding',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'position',
    'top',
    'right',
    'bottom',
    'left',
    'z-index',
    'display',
    'box-sizing',
    'overflow',
    'overflow-x',
    'overflow-y',
  ];

  const typographyProperties = [
    'font',
    'font-family',
    'font-size',
    'font-weight',
    'font-style',
    'line-height',
    'text-align',
    'text-decoration',
    'text-transform',
    'color',
    'letter-spacing',
    'word-spacing',
    'white-space',
  ];

  const flexGridProperties = [
    'display',
    'flex',
    'flex-direction',
    'flex-wrap',
    'flex-flow',
    'flex-grow',
    'flex-shrink',
    'flex-basis',
    'justify-content',
    'align-items',
    'align-content',
    'align-self',
    'order',
    'grid',
    'grid-template',
    'grid-template-columns',
    'grid-template-rows',
    'grid-template-areas',
    'grid-column',
    'grid-row',
    'grid-area',
    'grid-gap',
    'grid-column-gap',
    'grid-row-gap',
  ];

  // 결과 그룹 초기화
  const result: StyleGroup[] = [
    { name: 'Layout', styles: {} },
    { name: 'Typography', styles: {} },
    { name: 'Flex & Grid', styles: {} },
    { name: 'Other', styles: {} },
  ];

  // 각 스타일 속성을 적절한 그룹에 분류
  Object.entries(styles).forEach(([property, value]) => {
    if (layoutProperties.includes(property)) {
      result[0].styles[property] = value;
    } else if (typographyProperties.includes(property)) {
      result[1].styles[property] = value;
    } else if (flexGridProperties.includes(property)) {
      result[2].styles[property] = value;
    } else {
      result[3].styles[property] = value;
    }
  });

  // 내용이 있는 그룹만 반환
  return result.filter(group => Object.keys(group.styles).length > 0);
}

export function extractElementInfo(element: HTMLElement): ElementInfo | null {
  if (!element) return null;

  const userDefinedStyles = getUserDefinedStyles(element);

  const elementInfo: ElementInfo = {
    tagName: element.tagName.toLowerCase(),
    className: element.className,
    width: element.offsetWidth,
    height: element.offsetHeight,
    styleGroups: categorizeStyles(userDefinedStyles),
  };

  return elementInfo;
}
