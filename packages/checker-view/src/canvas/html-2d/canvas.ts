import { Coordinate, MATRIX_SIZE } from 'checker-model';
import { Scale, IPallete } from '../types';
import { DEFAULT_SCALE2D, DEFAULT_PALLETE, OFFSET_COORDINATE, LINE_WIDTH, COMPOSITION_TYPE } from '../constants';
import { AbstractCanvas } from '../abstract-canvas';
import { Zoom2D } from './zoom';
import { RotateY2D } from './rotate-y';
import { OffsetX2D } from './offset-x';

export class HTMLCanvas2d extends AbstractCanvas<Coordinate> {
  private deviceContext: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private onClickHandler = (ev: MouseEvent): void => {
    this.emit('click', this.untransform({ x: ev.x, y: ev.y }));
  };

  constructor(
    canvas: HTMLCanvasElement,
    scale: Scale<Coordinate> = DEFAULT_SCALE2D,
    pallete: IPallete<string> = DEFAULT_PALLETE,
  ) {
    super(pallete, scale);

    this.canvas = canvas;
    this.canvas.onclick = this.onClickHandler;

    const deviceContext = this.canvas.getContext('2d');
    if (deviceContext === null) {
      throw new Error('init canvas error!');
    }
    this.deviceContext = deviceContext;
    this.deviceContext.lineWidth = LINE_WIDTH;
    this.deviceContext.globalCompositeOperation = COMPOSITION_TYPE;
    this.setColor(this.getColor());
    this.setTransforms([
      new RotateY2D(Math.PI / 6),
      new OffsetX2D(OFFSET_COORDINATE),
      new Zoom2D(this.getZoomFactor()),
    ]);
  }

  untransform(to: Coordinate): Coordinate {
    const coord = super.untransform(to);
    coord.x = Math.round(coord.x);
    coord.y = Math.round(coord.y);
    return coord;
  }

  line(begin: Coordinate, end: Coordinate): boolean {
    begin = this.transform(begin);
    end = this.transform(end);

    this.deviceContext.moveTo(begin.x, begin.y);
    this.deviceContext.lineTo(end.x, end.y);
    return true;
  }

  circle(coord: Coordinate, r: number): boolean {
    coord = this.transform(coord);

    this.deviceContext.beginPath();
    this.deviceContext.arc(coord.x, coord.y, r, 0, Math.PI * 2);

    if (this.getFillMode() == 'fill') {
      this.deviceContext.fill();
    } else {
      this.deviceContext.stroke();
    }

    return true;
  }

  putPixel(coord: Coordinate): boolean {
    coord = this.transform(coord);

    this.deviceContext.rect(coord.x, coord.y, 1, 1);
    this.deviceContext.fill();
    return true;
  }

  setColor(color: number): boolean {
    if (!super.setColor(color)) {
      return false;
    }
    this.deviceContext.fillStyle = this.deviceContext.strokeStyle = this.getPallete().getColor(color);
    return true;
  }

  private getZoomFactor(): number {
    const length = Math.min(Number(this.canvas.getAttribute('width')), Number(this.canvas.getAttribute('height')));
    return length / MATRIX_SIZE;
  }
}
