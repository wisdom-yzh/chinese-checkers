import { SinglePlayerCheckerGameGui } from '../../lib/single/index';

class GameGuiDemo extends SinglePlayerCheckerGameGui {
  onGameEnd() {
    console.log('end');
  }

  onGameStart() {
    console.log('start');
  }

  onGameWin(factionId) {
    console.log(`${factionId} wins`);
  }

  onChessMove(steps) {
    console.log(steps.length);
  }

  onClick(coord) {
    console.log(coord);
  }
}

const canvasElement = document.getElementById('main');
const game = new GameGuiDemo({
  canvasElement,
  players: [0, 3],
  aiPlayers: [
    { factionId: 0, difficulty: 'simple' },
    { factionId: 3, difficulty: 'hard' },
  ],
  myFactionId: undefined,
});
game.start();
