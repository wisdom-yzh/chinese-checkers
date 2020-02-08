import { Slot } from 'checker-model';

export interface IElement<TProps> {
  render(): boolean;
  getProps(): TProps;
  updateProps(props: TProps): boolean;
}

export interface IView<T> extends IElement<T> {
  getChildren(): IElement<unknown>[];
}

export type FocusStatus = 'normal' | 'mention' | 'focus';

export type SlotProps<TCoordinate> = Slot & {
  coordinate: TCoordinate;
  status: FocusStatus;
};
