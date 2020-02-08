import { Coordinate } from 'checker-model';
import { ITransform } from '../types';

export class Zoom2D implements ITransform<Coordinate> {
  private factor: number;

  constructor(factor: number) {
    this.factor = factor || 1;
  }

  transform(from: Coordinate): Coordinate {
    return { x: from.x * this.factor, y: from.y * this.factor };
  }

  untransform(to: Coordinate): Coordinate {
    return { x: to.x / this.factor, y: to.y / this.factor };
  }
}
