import { CheckerGameGui } from './checker-game';

export function main(): void {
  const canvasElement = document.getElementById('main') as HTMLCanvasElement;
  const game = new CheckerGameGui(canvasElement);
  game.start([0, 1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5]);
}

main();
