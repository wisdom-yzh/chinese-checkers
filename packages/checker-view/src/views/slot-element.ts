import { AbstractElement } from './abstract-element';
import { ICanvas, COLOR_PIECE_OBSTACLE, COLOR_CLEAR } from '../canvas';
import { SlotProps } from './types';
import { R_SLOT, SLOT_COLOR_DICT, PIECE_COLOR_DICT, STATUS_COLOR_DICT, R_PIECE, R_MAX, R_FOCUS } from './constants';
import { FactionIdentity } from 'checker-model';

export class SlotElement<TCoordinate, TColor> extends AbstractElement<SlotProps<TCoordinate>, TCoordinate, TColor> {
  constructor(slot: SlotProps<TCoordinate>, canvas: ICanvas<TCoordinate, TColor>) {
    super(slot, canvas);
  }

  protected renderView(): boolean {
    const props = this.getProps();
    if (props.slotCategory === 'unavailable') {
      return true;
    }

    return this.clearArea() && this.renderSlot() && this.renderPiece() && this.renderStatus();
  }

  protected checkUpdate(props: SlotProps<TCoordinate>, nextProps: SlotProps<TCoordinate>): boolean {
    if (props.status !== nextProps.status) {
      return true;
    }

    if ((props.piece === null && nextProps.piece !== null) || (props.piece !== null && nextProps.piece === null)) {
      return true;
    }

    if (props.piece !== null && nextProps.piece !== null) {
      return props.piece.getFactionId() !== nextProps.piece.getFactionId();
    }

    return false;
  }

  private clearArea(): boolean {
    const props = this.getProps();
    const canvas = this.getCanvas();

    if (!canvas.setColor(COLOR_CLEAR)) {
      return false;
    }

    return canvas.setFillMode('fill').circle(props.coordinate, R_MAX);
  }

  private renderSlot(): boolean {
    const props = this.getProps();
    const canvas = this.getCanvas();

    if (!canvas.setColor(SLOT_COLOR_DICT[props.slotCategory])) {
      return false;
    }

    return canvas.setFillMode('stroke').circle(props.coordinate, R_SLOT);
  }

  private renderPiece(): boolean {
    const canvas = this.getCanvas();
    const props = this.getProps();
    const piece = props.piece;

    if (piece === null) {
      return true;
    }

    const factionId = piece.getFactionId();
    if (factionId === null && !canvas.setColor(COLOR_PIECE_OBSTACLE)) {
      return false;
    }

    if (!canvas.setColor(PIECE_COLOR_DICT[factionId as FactionIdentity])) {
      return false;
    }

    return canvas.setFillMode('fill').circle(props.coordinate, R_PIECE);
  }

  private renderStatus(): boolean {
    const canvas = this.getCanvas();
    const props = this.getProps();

    if (props.status === 'normal') {
      return true;
    }

    if (!canvas.setColor(STATUS_COLOR_DICT[props.status])) {
      return false;
    }

    return canvas.setFillMode('stroke').circle(props.coordinate, R_FOCUS);
  }
}
