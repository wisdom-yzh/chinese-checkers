import { IBoard, Coordinate, MATRIX_SIZE } from 'checker-model';
import { ICanvas, IEventListener, CanvasEventHandler } from '../canvas';
import { AbstractView } from './abstract-view';
import { SlotElement } from './slot-element';
import { FocusStatus } from './types';

const f = ({ x, y }: Coordinate): number => y * MATRIX_SIZE + x;

export abstract class CheckerView<TCoordinate, TColor> extends AbstractView<IBoard, TCoordinate, TColor>
  implements IEventListener<Coordinate> {
  constructor(board: IBoard, canvas: ICanvas<TCoordinate, TColor>) {
    super(board, canvas, []);
    this.initSlots();
    this.initEvents();
  }

  private initSlots(): void {
    const board = this.getProps();
    const elements = this.getChildren() as SlotElement<TCoordinate, TColor>[];

    board.getSlotMatrix().forEach((row, y) => {
      row.forEach((slot, x) => {
        elements.push(
          new SlotElement(
            {
              ...slot,
              coordinate: this.convert({ x, y }),
              status: 'normal',
            },
            this.getCanvas(),
          ),
        );
      });
    });
  }

  private initEvents(): void {
    this.getCanvas().onClick(coordinate => {
      this.emit('click', this.reconvert(coordinate));
    });
  }

  setFocusStatus(coord: Coordinate, status: FocusStatus): boolean {
    const elements = this.getChildren() as SlotElement<TCoordinate, TColor>[];
    const element = elements[f(coord)];
    const props = element.getProps();

    if (
      !element.updateProps({
        ...props,
        status,
      })
    ) {
      return false;
    }

    return element.render();
  }

  updateProps(props: IBoard): boolean {
    if (!super.updateProps(props)) {
      return false;
    }

    const elements = this.getChildren() as SlotElement<TCoordinate, TColor>[];
    const board = this.getProps();

    board.getSlotMatrix().forEach((row, y) => {
      row.forEach((slot, x) => {
        const element = elements[f({ x, y })];
        element.updateProps({
          ...element.getProps(),
          ...slot,
          status: 'normal',
        });
      });
    });

    return true;
  }

  /**
   * click event handler
   */
  onClick(handler: CanvasEventHandler<Coordinate>): void {
    this.on('click', handler);
  }

  // eslint-disable-next-line
  protected checkUpdate(props: IBoard, nextProps: IBoard): boolean {
    return true;
  }

  protected renderView(): boolean {
    return true;
  }

  /**
   * convert board coordinate to canvas coordinate
   */
  protected abstract convert(coord: Coordinate): TCoordinate;

  /**
   * reconvert canvas coordinate to board coordinate
   */
  protected abstract reconvert(coord: TCoordinate): Coordinate;
}
