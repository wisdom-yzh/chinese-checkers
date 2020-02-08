import { IPallete } from './types';
import { COLOR_SCHEMA } from './constants';

export class Pallete implements IPallete<string> {
  private colorMap: Record<number, string>;

  constructor(colorMap?: Record<number, string>) {
    this.colorMap = colorMap || COLOR_SCHEMA;
  }

  setColorMap(colorMap: Record<number, string>): void {
    this.colorMap = colorMap;
  }

  addColorMap(colorMap: Record<number, string>): void {
    Object.assign(this.colorMap, colorMap);
  }

  getColor(key: number): string {
    return this.colorMap[key];
  }

  getDefaultColorKey(): number {
    const keys = Object.keys(this.colorMap);
    if (!keys.length) {
      return 0;
    }
    return Number(keys[0]);
  }

  getDefaultColor(): string {
    return this.colorMap[this.getDefaultColorKey()] || '';
  }
}
