// Move the mouse across the screen as a sine wave.
const robot = require("robotjs");

// Speed up the mouse.
robot.setMouseDelay(2);

const twoPI = Math.PI * 2.0;
const screenSize = robot.getScreenSize();
const height = screenSize.height / 2 - 10;
const width = screenSize.width;

for (let x = 0; x < width; x++) {
  y = height * Math.sin((twoPI * x) / width) + height;
  console.log(x, y);
  robot.moveMouse(x, y);
}
