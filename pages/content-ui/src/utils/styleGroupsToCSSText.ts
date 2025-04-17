import type { StyleGroup } from '@extension/shared';

export function styleGroupsToCSSText(styleGroups: StyleGroup[]) {
  const styles = styleGroups.flatMap(group => Object.entries(group.styles));

  return styles.map(([key, value]) => `${key}: ${value}`).join(';\n');
}
