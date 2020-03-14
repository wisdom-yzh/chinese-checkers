import { Coordinate, MoveStep } from 'checker-model';
import { AbstractCheckerGameGui } from '../base';
import { ICheckerGameGuiProps } from '../interface';

export abstract class MultiPlayersCheckerGameGui extends AbstractCheckerGameGui {
  constructor(props: ICheckerGameGuiProps) {
    super(props);
  }

  protected moveByMyself(to: Coordinate): Promise<MoveStep> {
    return super.moveByMyself(to);
  }

  // protected moveByOthers(): Promise<MoveStep> {}
}
