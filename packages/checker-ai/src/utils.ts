import { Coordinate } from 'checker-model';

export const dist = (a: Coordinate, b: Coordinate): number => {
  const deltaX = a.x - b.x;
  const deltaY = a.y - b.y;

  if (Math.abs(deltaX) < Math.abs(deltaY)) {
    return Math.abs(deltaX) + Math.abs(a.y - deltaX - b.y);
  } else {
    return Math.abs(deltaY) + Math.abs(a.x - deltaY - b.x);
  }
};

export const minDistanceFromGoal = (point: Coordinate, goals: Coordinate[]): number => {
  let minDist = 0xff;

  goals.forEach(goal => {
    minDist = Math.min(minDist, dist(goal, point));
  });

  return minDist;
};

export const stepDistance = (goals: Coordinate[], from: Coordinate, to: Coordinate): number => {
  return minDistanceFromGoal(from, goals) - minDistanceFromGoal(to, goals);
};
