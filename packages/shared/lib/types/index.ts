export type StyleGroupName = 'Layout' | 'Typography' | 'Flex & Grid';

export interface StyleGroup {
  name: StyleGroupName;
  styles: {
    [key: string]: string;
  };
}

export interface ElementInfo {
  tagName: string;
  className: string;
  width: number;
  height: number;
  styleGroups: StyleGroup[];
}
