const colors = ["#225ee1", "#28d7bf", "#ac53cf", "#e7a39c"];
const backgroundColor = "#31AFD4";
const width = window.innerWidth;
const height = window.innerHeight;
const totalFrames = 1000;
let frameCount = 0;

let s;

function setup() {
  createCanvas(width, height, WEBGL);
  noiseSeed(20);
  rectMode(CENTER);
  noStroke();

  let vert = document.getElementById("vertShader").textContent;
  let frag = document.getElementById("fragShader").textContent;
  s = createShader(vert, frag);
}

function draw() {
  frameCount++;
  background(backgroundColor);
  shader(s);

  s.setUniform("uResolution", [width, height]);
  s.setUniform("uTime", millis() / 100);
  s.setUniform("uSpeedColor", 20.0);

  s.setUniform("uColor1", hex2rgb(colors[0]));
  s.setUniform("uColor2", hex2rgb(colors[1]));
  s.setUniform("uColor3", hex2rgb(colors[2]));
  s.setUniform("uColor4", hex2rgb(colors[3]));

  rect(0, 0, width, height);
}

function hex2rgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return [r / 255, g / 255, b / 255];
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}
