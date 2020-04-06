import 'socket.io-client';
import { isEmpty } from 'lodash-es';
import { MoveStep, FactionIdentity, IPiece } from 'checker-model';
import { GameStatusMessage, SYNC_GAME } from 'checker-transfer-contract';
import { AbstractCheckerGameGui } from '../base';
import { ICheckerGameGuiProps } from '../interface';

export abstract class MultiPlayersCheckerGameGui extends AbstractCheckerGameGui {
  private moveByOthersPromise: Promise<MoveStep> | null = null;
  private statusQueue: Record<FactionIdentity, MoveStep[]> = {} as Record<FactionIdentity, MoveStep[]>;
  private socket: SocketIOClient.Socket;

  constructor(props: ICheckerGameGuiProps, socket: SocketIOClient.Socket) {
    super(props);
    this.socket = socket;
  }

  protected moveByOthers(): Promise<MoveStep> {
    return new Promise(resolve => {
      const currentFactionId = this.model.getCurrentPlayer().faction.getId();
      if (!isEmpty(this.statusQueue[currentFactionId])) {
        const topValue = this.statusQueue[currentFactionId].splice(0, 1);
        resolve(topValue[0]);
        return;
      }

      this.socket.on(SYNC_GAME, (message: GameStatusMessage) => {
        console.log(currentFactionId);
        console.log('sync msg', message);
        const { current, from, to } = message;
        const step: MoveStep = { from, to, piece: this.model.getBoard().get(from) as IPiece };
        if (current === currentFactionId) {
          resolve(step);
        } else {
          if (isEmpty(this.statusQueue[current])) {
            this.statusQueue[current] = [step];
          } else {
            this.statusQueue[current].push(step);
          }
        }
      });
    });
  }
}
