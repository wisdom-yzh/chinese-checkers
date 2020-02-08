import { Coordinate, IBoard } from 'checker-model';
import { CheckerView, ICanvas } from 'checker-view';

export class CheckerViewGui extends CheckerView<Coordinate, string> {
  constructor(board: IBoard, canvas: ICanvas<Coordinate, string>) {
    super(board, canvas);
  }

  protected convert(coord: Coordinate): Coordinate {
    return coord;
  }

  protected reconvert(coord: Coordinate): Coordinate {
    return coord;
  }
}
