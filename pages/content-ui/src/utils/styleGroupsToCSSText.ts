import type { StyleGroup } from '@extension/shared';

export function styleGroupsToCSSText(styleGroups: StyleGroup[]) {
  return styleGroups
    .map(group => {
      return `${group.name}: ${Object.entries(group.styles)
        .map(([key, value]) => `${key}: ${value}`)
        .join(';')}`;
    })
    .join(';');
}
