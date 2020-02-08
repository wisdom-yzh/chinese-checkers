import { EventEmitter } from 'events';
import { isEqual } from 'lodash-es';
import { IElement } from './types';
import { ICanvas } from '../canvas';

export abstract class AbstractElement<TProps, TCoordinate, TColor> extends EventEmitter implements IElement<TProps> {
  private props: TProps;
  private updated = true;
  private canvas: ICanvas<TCoordinate, TColor>;

  constructor(props: TProps, canvas: ICanvas<TCoordinate, TColor>) {
    super();
    this.props = props;
    this.canvas = canvas;
  }

  getProps(): TProps {
    return this.props;
  }

  getCanvas(): ICanvas<TCoordinate, TColor> {
    return this.canvas;
  }

  updateProps(props: TProps): boolean {
    if (!this.checkUpdate(this.props, props)) {
      return false;
    }
    this.props = props;
    this.updated = true;
    return true;
  }

  render(): boolean {
    if (!this.updated) {
      return true;
    }

    if (this.renderView()) {
      this.updated = false;
      return true;
    }

    return false;
  }

  protected checkUpdate(props, nextProps: TProps): boolean {
    return !isEqual(props, nextProps);
  }

  protected abstract renderView(): boolean;
}
