import { EventEmitter } from 'events';
import { ICanvas, Scale, IPallete, FillMode, ITransformable, ITransform, CanvasEventHandler } from './types';

export abstract class AbstractCanvas<TCoordinate> extends EventEmitter
  implements ICanvas<TCoordinate, string>, ITransformable<TCoordinate> {
  private color: number;

  private transforms: ITransform<TCoordinate>[] = [];

  private scale: Scale<TCoordinate>;

  private fillMode: FillMode = 'fill';

  private pallete: IPallete<string>;

  constructor(pallete: IPallete<string>, scale: Scale<TCoordinate>) {
    super();
    this.pallete = pallete;
    this.color = this.pallete.getDefaultColorKey();
    this.scale = scale;
  }

  getScale(): Scale<TCoordinate> {
    return this.scale;
  }

  setScale(scale: Scale<TCoordinate>): AbstractCanvas<TCoordinate> {
    this.scale = scale;
    return this;
  }

  getFillMode(): FillMode {
    return this.fillMode;
  }

  setFillMode(fm: FillMode): AbstractCanvas<TCoordinate> {
    this.fillMode = fm;
    return this;
  }

  getPallete(): IPallete<string> {
    return this.pallete;
  }

  getColor(): number {
    return this.color;
  }

  setColor(color: number): boolean {
    if (this.pallete.getColor(color) === '') {
      return false;
    }
    this.color = color;
    return true;
  }

  setTransforms(transList: ITransform<TCoordinate>[]): void {
    this.transforms = transList;
  }

  addTransform(trans: ITransform<TCoordinate>): void {
    this.transforms.push(trans);
  }

  getTransforms(): ITransform<TCoordinate>[] {
    return this.transforms;
  }

  transform(from: TCoordinate): TCoordinate {
    return this.getTransforms().reduce<TCoordinate>((coordinate, trans) => trans.transform(coordinate), from);
  }

  untransform(to: TCoordinate): TCoordinate {
    return this.getTransforms().reduceRight<TCoordinate>((coordinate, trans) => trans.untransform(coordinate), to);
  }

  onClick(handler: CanvasEventHandler<TCoordinate>): void {
    this.on('click', handler);
  }

  abstract putPixel(coord: TCoordinate): boolean;

  abstract circle(coord: TCoordinate, r: number): boolean;

  abstract line(begin: TCoordinate, end: TCoordinate): boolean;
}
