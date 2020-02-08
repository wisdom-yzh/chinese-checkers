import { CheckerGameGui } from './checker-game';

export function main(): void {
  const canvasElement = document.getElementById('main') as HTMLCanvasElement;
  const game = new CheckerGameGui(canvasElement);
  game.start([0, 3]);
}

main();
