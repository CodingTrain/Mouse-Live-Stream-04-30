const fs = require("fs");
const tf = require("@tensorflow/tfjs-node");

const data = fs.readFileSync("mouse1619811425166.csv", "utf-8");

const lines = data.split("\n");

const rawInput = [];
const rawOutput = [];

// Should I try more or fewer points?
const chunks = 10;

for (let i = 0; i < lines.length - chunks - 1; i++) {
  let chunk = [];
  for (let j = 0; j < chunks; j++) {
    let row = lines[i + j].split(",");
    let x = row[0];
    let y = row[1];
    chunk.push(x / 1920, y / 1080);
  }
  rawInput.push(chunk);
  let next = lines[i + chunks].split(",");
  let x = next[0];
  let y = next[1];
  rawOutput.push([x / 1920, y / 1080]);
}

const rows = rawInput.length;
const xs = tf.tensor(rawInput, [rows, chunks * 2]);
const ys = tf.tensor(rawOutput, [rows, 2]);
ys.print();

// Is this model architecture reasonable?
const model = tf.sequential();
model.add(
  tf.layers.dense({
    units: 32,
    inputShape: [chunks * 2],
    activation: "sigmoid", //???
  })
);

model.add(
  tf.layers.dense({
    units: 2,
    activation: "sigmoid",
  })
);

const LEARNING_RATE = 0.01; // ???
const optimizer = tf.train.sgd(LEARNING_RATE); // ???

// what optimizer and loss function?
model.compile({
  optimizer: optimizer,
  loss: "meanSquaredError",
  metrics: ["accuracy"],
});

go();

// function moveMouse(point) {
//   console.log(point[0] * 1920, point[1] * 1080);
//   robot.setMouseDelay(100);
//   robot.moveMouse(point[0] * 1920, point[1] * 1080);
// }

async function go() {
  await train();
  // const r = Math.floor(Math.random() * rawInput.length);
  // const inputs = rawInput[r].slice();
  // let next = await predict(inputs);
  // for (let i = 0; i < 100; i++) {
  //   inputs.splice(0, 2);
  //   inputs.push(next[0], next[1]);
  //   next = await predict(inputs);
  // }
}

async function train() {
  const h = await model.fit(xs, ys, {
    epochs: 1,
  });
  console.log("Loss: " + h.history.loss[0]);
}

async function predict(inputs) {
  const xs = tf.tensor([inputs], [1, chunks * 2]);
  const outputs = await model.predict(xs);
  const xy = await outputs.data();
  return xy;
}

const express = require("express");

const app = express();
app.listen(3000, () => console.log("listening at 3000"));
app.use(express.json({ limit: "1mb" }));

// How to start the input?
// Pull from training data?
let pInputs = [];
for (let i = 0; i < chunks * 2; i++) {
  pInputs[i] = Math.random();
}

app.get("/reset", async (request, response) => {
  for (let i = 0; i < snapshot; i++) {
    pInputs[i] = Math.random() * 2 - 1;
  }
  response.send("a-ok");
});

app.get("/mouse", async (request, response) => {
  const next = await predict(pInputs);
  // next = [Math.random(), Math.random()];
  console.log(next);
  pInputs.splice(0, 2);
  pInputs.push(next[0]);
  pInputs.push(next[1]);
  // response.json({ status: { mouseX: next[0], mouseY: next[1] } });
  response.send(`${next[0]},${next[1]}`);
});
