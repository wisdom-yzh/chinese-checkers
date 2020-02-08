import { Coordinate } from 'checker-model';
import { ITransform } from '../types';

export class RotateY2D implements ITransform<Coordinate> {
  private radius: number;

  constructor(radius: number) {
    this.radius = radius || 0;
  }

  transform(from: Coordinate): Coordinate {
    return {
      x: from.x - from.y * Math.sin(this.radius),
      y: from.y * Math.cos(this.radius),
    };
  }

  untransform(to: Coordinate): Coordinate {
    return {
      x: to.x + to.y * Math.tan(this.radius),
      y: to.y / Math.cos(this.radius),
    };
  }
}
