export type Scale<TCoordinate> = {
  leftTop: TCoordinate;
  rightBottom: TCoordinate;
};

export type FillMode = 'stroke' | 'fill';

export type CanvasEventHandler<TCoordinate> = (coord: TCoordinate) => void;

export interface IEventListener<TCoordinate> {
  onClick(handler: CanvasEventHandler<TCoordinate>): void;
}

export interface ITransform<TCoordinate> {
  transform(from: TCoordinate): TCoordinate;
  untransform(to: TCoordinate): TCoordinate;
}

export interface IPallete<TColor> {
  getDefaultColorKey(): number;
  getDefaultColor(): TColor;
  getColor(key: number): TColor;
}

export interface ITransformable<TCoordinate> extends ITransform<TCoordinate> {
  getTransforms(): ITransform<TCoordinate>[];
  setTransforms(trans: ITransform<TCoordinate>[]);
  addTransform(trans: ITransform<TCoordinate>);
}

export interface ICanvas<TCoordinate, TColor> extends IEventListener<TCoordinate> {
  /**
   * canvas coordinate scale
   */
  getScale(): Scale<TCoordinate>;
  setScale(scale: Scale<TCoordinate>): ICanvas<TCoordinate, TColor>;

  /**
   * pallete object
   */
  getPallete(): IPallete<TColor>;

  /**
   * fill mode
   */
  getFillMode(): FillMode;
  setFillMode(fm: FillMode): ICanvas<TCoordinate, TColor>;

  /**
   * set color
   */
  setColor(color: number): boolean;
  getColor(): number;

  /**
   * put pixel method
   */
  putPixel(coord: TCoordinate): boolean;

  /**
   * draw cirle
   */
  circle(coord: TCoordinate, r: number): boolean;

  /**
   * draw line
   */
  line(begin: TCoordinate, end: TCoordinate): boolean;
}
