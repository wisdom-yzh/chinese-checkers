import { Coordinate } from 'checker-model';
import { ITransform } from '../types';

export class OffsetX2D implements ITransform<Coordinate> {
  private unit: Coordinate;

  constructor(unit: Coordinate) {
    this.unit = unit;
  }

  transform(from: Coordinate): Coordinate {
    return {
      x: from.x + this.unit.x,
      y: from.y + this.unit.y,
    };
  }

  untransform(to: Coordinate): Coordinate {
    return {
      x: to.x - this.unit.x,
      y: to.y - this.unit.y,
    };
  }
}
