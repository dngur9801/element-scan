import type { ElementInfo, StyleGroup } from '../../../../packages/shared/lib/types';
import { colorManager } from './colorManager';

// 제외할 스타일 속성 패턴 정의
const excludePatterns: string[] = ['webkit-', 'moz-', 'ms-', 'o-'];

// 제외할 스타일 값
const excludeValues: string[] = [
  'auto',
  'initial',
  'unset',
  'none',
  'transparent',
  'currentColor',
  'inherit',
  'static',
  'normal',
  'rgba(0, 0, 0, 0)',
];

function getUserDefinedStyles(element: HTMLElement): Record<string, string> {
  const definedStyles: Record<string, string> = {};

  // window.getComputedStyle을 사용하여 계산된 스타일 가져오기
  const computedStyle = window.getComputedStyle(element);

  // 모든 계산된 스타일 속성을 순회
  for (let i = 0; i < computedStyle.length; i++) {
    const propertyName: string = computedStyle[i];
    const propertyValue: string = computedStyle.getPropertyValue(propertyName);

    // 값이 있는 속성만 저장
    if (propertyValue && propertyValue !== '') {
      definedStyles[propertyName] = propertyValue;
    }
  }

  // 인라인 스타일 추가 (인라인 스타일이 더 우선순위가 높으므로 마지막에 추가)
  const inlineStyle: CSSStyleDeclaration = element.style;
  for (let i = 0; i < inlineStyle.length; i++) {
    const propertyName: string = inlineStyle[i];
    const propertyValue = inlineStyle.getPropertyValue(propertyName);
    if (propertyValue && propertyValue !== '') {
      definedStyles[propertyName] = propertyValue;
    }
  }

  const mergedStyles = mergeBoxModelProperties(definedStyles, ['margin', 'padding']);

  return mergedStyles;
}

// 스타일 속성을 그룹으로 분류하는 함수
function categorizeStyles(styles: Record<string, string>): StyleGroup[] {
  // 그룹별 속성 분류 정의
  const styleGroupsDef: {
    name: 'Layout' | 'Typography' | 'Appearance';
    properties: string[];
  }[] = [
    {
      name: 'Layout',
      properties: [
        'display',
        'justify-content',
        'align-items',
        'flex',
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
      ],
    },
    {
      name: 'Typography',
      properties: ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'color'],
    },
    {
      name: 'Appearance',
      properties: ['background-color', 'box-shadow', 'border', 'border-radius', 'z-index'],
    },
  ];

  const result: StyleGroup[] = styleGroupsDef.map(group => ({
    name: group.name,
    styles: {},
  }));

  // RGB 색상 값을 HEX로 변환하는 함수
  const convertColorValuesToHex = (property: string, value: string): string => {
    // 색상 속성인지 확인
    if (colorManager.isColorProperty(property)) {
      // 색상 추출 및 변환
      const colorValue = colorManager.extractColorFromValue(value);
      if (colorValue) {
        const hexColor = colorManager.rgbToHex(colorValue);
        // 원래 값에서 색상 부분만 변환
        if (hexColor !== colorValue) {
          return value.replace(colorValue, hexColor);
        }
      }
    }
    return value;
  };

  styleGroupsDef.forEach((group, index) => {
    group.properties.forEach(property => {
      if (!(property in styles)) return;
      const value = styles[property];
      if (!value || excludePatterns.some(pattern => property.startsWith(pattern))) return;
      if (excludeValues.includes(value)) return;

      // 색상 값 변환 적용
      const convertedValue = convertColorValuesToHex(property, value);
      result[index].styles[property] = convertedValue;
    });
  });

  // 내용이 있는 그룹만 반환
  return result.filter(group => Object.keys(group.styles).length > 0);
}

function mergeBoxModelProperties(
  styles: Record<string, string>,
  properties: ('margin' | 'padding')[],
): Record<string, string> {
  const newStyles: Record<string, string> = { ...styles };

  properties.forEach(property => {
    const top = newStyles[`${property}-top`];
    const right = newStyles[`${property}-right`];
    const bottom = newStyles[`${property}-bottom`];
    const left = newStyles[`${property}-left`];

    if (top || right || bottom || left) {
      newStyles[property] = `${top ?? '0px'} ${right ?? '0px'} ${bottom ?? '0px'} ${left ?? '0px'}`;
      delete newStyles[`${property}-top`];
      delete newStyles[`${property}-right`];
      delete newStyles[`${property}-bottom`];
      delete newStyles[`${property}-left`];
    }
  });

  return newStyles;
}

export function extractElementInfo(element: HTMLElement): ElementInfo | null {
  if (!element) return null;

  const userDefinedStyles = getUserDefinedStyles(element);

  const elementInfo: ElementInfo = {
    tagName: element.tagName.toLowerCase(),
    className: element.className.split(' ')[0],
    width: element.offsetWidth,
    height: element.offsetHeight,
    styleGroups: categorizeStyles(userDefinedStyles),
  };

  return elementInfo;
}
