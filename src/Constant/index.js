const CANVAS_SIZE = [600, 600];
const SNAKE_START = [
  [20, 19],
  [20, 20]
];
const APPLE_START = [20, 15];
const SCALE = 15;
const SPEED = 100;
const DIRECTIONS = {
  38: [0, -1], // up
  40: [0, 1], // down
  37: [-1, 0], // left
  39: [1, 0] // right
};

export {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS
};