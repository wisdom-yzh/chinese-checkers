import { IView, IElement } from './types';
import { AbstractElement } from './abstract-element';
import { ICanvas } from '../canvas';

export abstract class AbstractView<TProps, TCoordinate, TColor> extends AbstractElement<TProps, TCoordinate, TColor>
  implements IView<TProps> {
  private elements: IElement<unknown>[] = [];

  constructor(props: TProps, canvas: ICanvas<TCoordinate, TColor>, elements: IElement<unknown>[]) {
    super(props, canvas);
    this.elements = elements;
  }

  getChildren(): IElement<unknown>[] {
    return this.elements;
  }

  render(): boolean {
    let success = super.render();

    this.elements.forEach(element => {
      if (!success) {
        return;
      }
      success = success && element.render();
    });

    return success;
  }
}
