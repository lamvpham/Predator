// predator variables
let predator;
let predatorDiameter = 20; // initial diameter
let predatorColour = [50,39,144]; // initial colour
let predatorWaves = []; // initialize array for waves & saving waves in this array
let isChasing = false; // boolean for the predator to chase prey

// prey variables
let objects = [];
let preyWaves = [];

// wave variables
let waveSpacing = 12; // frames between consecutive waves in a burst = 0.2s gaps
let burstSpacing = 180; // frames of pause between bursts = 3s
let wavesPerBurst // # of waves in each burst
let waveCount = 0; // waves counter in the current burst
let waveState = "emitting"; // wave state ("emitting" or "pausing")
let frameCounter = 0; // frame counter to control timing between bursts based on waveSpacing and changing waveStates - based on p5.js library (see documentation)

// audio variables
let munchSound; // psycho violins
let chaseSound; // jaws theme!

// additioanl variables
let delayStartTime = 0; // initial delay time before predator starts chasing
let catchTime = 0; // used to capture specific # of frames defined below before new prey spawns
let isDelayActive = false;


// preloading audios
function preload() {
  chaseSound = loadSound('audios/jaws-theme.mp3');
  munchSound = loadSound('audios/munch.mp3'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();

  // initializing predator with centered location + random direction + random speed with perlin noise offset for its movement
  // refering to Perlin Noise Movement (see documentation)
  predator = {
    // referencing p5.js library (see documentation)
    position: createVector(width / 2, height / 2),
    velocity: p5.Vector.random2D().mult(random(0.25, 0.5)),
    noiseOffsetX: random(100),
    noiseOffsetY: random(100)
  };

  // initializing prey in random location with perlin noise offset for its movement
  // refering to Perlin Noise Movement (see documentation)
  for (let i = 0; i < 1; i++) {
    objects.push({
      // referencing p5.js library (see documentation)
      position: createVector(random(width), random(height)),
      noiseOffsetX: random(100),
      noiseOffsetY: random(100)
    });
  }
}

function draw() {
  background(19, 10, 78); // dark blue ocean background

  // predator details
  // update predator location with perlin noise-based movement
  // refering to Perlin Noise Movement (see documentation)
  predator.position.add(noiseVector(predator.noiseOffsetX, predator.noiseOffsetY));
  predator.noiseOffsetX += 0.01;
  predator.noiseOffsetY += 0.01;
  boundary(predator.position); // canvas boundary wrapping
  predatorMovement();
  stroke(predatorColour);
  ellipse(predator.position.x, predator.position.y, predatorDiameter);

  // prey details
  // update prey location with perlin noise-based movement
  // refering to Perlin Noise Movement (see documentation)
  objects.forEach(obj => {
    obj.position.add(noiseVector(obj.noiseOffsetX, obj.noiseOffsetY));
    obj.noiseOffsetX += 0.01;
    obj.noiseOffsetY += 0.01;
    boundary(obj.position); // canvas boundary wrapping
    stroke('#A87E1E');
    ellipse(obj.position.x, obj.position.y, 10, 10);
  });

  // update prey movement
  preyMovement();
  // check if predator caught a prey
  diditcatch();
  // emit waves from predator in bursts
  emitWaves();
  // update + display predator waves and their interaction with prey
  updateWaves(predatorWaves, true);
  // update + display prey waves
  updateWaves(preyWaves, false);
}

// perlin noise to affect the direction of movements of the predator/prey to appear more natural (referring to Perlin Noise Movement - see documentation)
function noiseVector(xOffset, yOffset) {
  let noiseX = map(noise(xOffset), 0, 1, -1, 1);
  let noiseY = map(noise(yOffset), 0, 1, -1, 1);
  return createVector(noiseX, noiseY);
}

// ensures the predator/prey objects don't go outside the canvas edges
function boundary(position) {
  if (position.x < 0) {
    position.x = 0;
  } 
  else if (position.x > width) {
    position.x = width; // so that the positions of the circles are always visible
  }

  if (position.y < 0) {
    position.y = 0;
  } 
  else if (position.y > height) {
    position.y = height; // so that the positions of the circles are always visible
  }
}

// upon browser window changing, it resizes the canvas
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// taken from p5.js for full screen mode 
function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

// movement of predator + chasing the prey movement
// inspired by 5.1 Steering Behavior - Predator and Prey (see documentation)
function predatorMovement() {
  // refering to Perlin Noise Movement + p5.js library for noise (see documentation)
  let noiseX = map(noise(predator.noiseOffsetX), 0, 1, -1, 1);
  let noiseY = map(noise(predator.noiseOffsetY), 0, 1, -1, 1);
  // referencing p5.js library (see documentation)
  predator.position.add(createVector(noiseX, noiseY));

  // initial 10s delay -> start chasing the prey
  if (frameCount - delayStartTime >= 600) {
    // if there is a prey spawned, the predator will chase it
    if (objects.length > 0) {
      // if it's not chasing the prey yet, chase now + start jaws theme
      if (!isChasing) {
        chaseSound.loop();
        isChasing = true;
      }
      let prey = objects[0];
      let direction = p5.Vector.sub(prey.position, predator.position); // point predator directly at prey's current location
      direction.setMag(0.95); // predator moves slightly slower than the prey - from p5.js library
      predator.velocity = direction; 
      predator.position.add(predator.velocity); // move the predator to the prey
    }
  }
}

// movement of prey + avoiding the edges of the canvas
// inspired by 5.1 Steering Behavior - Predator and Prey (see documentation)
function preyMovement() {
  objects.forEach(obj => {
    // avoiding the canvas edges - referencing p5.js library (see documentation)
    let repulsionForce = createVector(0, 0);
    let edgeThreshold = 50; // distance from edge before activating repulsionForce

    // checking all sides + applying repulsionForce if close
    if (obj.position.x < edgeThreshold) {
      repulsionForce.x += edgeThreshold - obj.position.x; // force to the right
    }
    if (obj.position.x > width - edgeThreshold) {
      repulsionForce.x -= obj.position.x - (width - edgeThreshold); // force to the left
    }
    if (obj.position.y < edgeThreshold) {
      repulsionForce.y += edgeThreshold - obj.position.y; // force downward
    }
    if (obj.position.y > height - edgeThreshold) {
      repulsionForce.y -= obj.position.y - (height - edgeThreshold); // force upward
    }

    // normalize and scale the force
    repulsionForce.normalize();
    repulsionForce.mult(2);

    // perlin noise for prey movement + noise (see documentation)
    let noiseX = map(noise(obj.noiseOffsetX), 0, 1, -1, 1);
    let noiseY = map(noise(obj.noiseOffsetY), 0, 1, -1, 1);

    // combine both repulsion force and perlin noise movement
    obj.position.add(repulsionForce);
    obj.position.add(createVector(noiseX, noiseY));

    // update increment over time for continuous movement variation
    obj.noiseOffsetX += 0.01;
    obj.noiseOffsetY += 0.01;
  });
}

// to see if the predator caught the prey -> if so, spawn a new one
// inspired + referencing Predator prey basics for targetting, chasing, and catching an object (see documentation)
function diditcatch() {
  for (let i = objects.length - 1; i >= 0; i--) {
    // distance between predator and prey using x and y
    let distBetween = dist(predator.position.x, predator.position.y, objects[i].position.x, objects[i].position.y);
    
    // if distance between is half of the predator's diameter, prey is caught
    if (distBetween < predatorDiameter / 2) { 
      objects.splice(i, 1); // remove caught prey
      munchSound.play();
      chaseSound.stop();
      isChasing = false; // predator is no longer chasing (for now)
      catchTime = frameCount; // marking the frame count that predator caught prey
      isDelayActive = true; // activate delay before next prey spawns

      // upon catching its prey, predator increases in size and slightly changes colours to be more visible
      predatorDiameter += 8; 
      predatorColour[0] = min(predatorColour[0] + 25, 255);
    }
  }

  // create new prey
  if (isDelayActive && frameCount - catchTime >= 1200) { // 20s delay
    // spawn the next prey for the predator to hunt
    objects.push({
      // referencing p5.js library (see documentation)
      position: createVector(random(width), random(height)),
      noiseOffsetX: random(1000),
      noiseOffsetY: random(1000)
    });
    isDelayActive = false; 
    isChasing = false; 
  }
}

// wave bursts/intervals emitted by predator
function emitWaves() {
  if (waveState === "emitting") {
    // if even number, emit new wave - frameCounter comes from p5.js library
    if (frameCounter % waveSpacing === 0) {
      // random value between 2 and 5 at the start of burst for the # of waves for that burst
      if (waveCount === 0) {
        wavesPerBurst = Math.floor(random(2, 6)); 
      }

      // tracking the # of waves currently emitted in burst, creates a new wave based on predator's current position
      if (waveCount < wavesPerBurst) {
        predatorWaves.push(new Wave(predator.position.x, predator.position.y));
        waveCount++;
      }
    }
    // if # of waves exceeds the wavesPerBurst, stop emitting waves and reset
    if (waveCount >= wavesPerBurst) {
      waveState = "pausing";
      frameCounter = 0; // Reset frame counter for the pause
      waveCount = 0; // Reset wave count for the next burst
    }
  } 
  else if (waveState === "pausing") {
    // if the frameCounter equals 3s, start emitting waves again
    if (frameCounter >= burstSpacing) {
      waveState = "emitting";
    }
  }
  frameCounter++;
}

// update + display predator waves and interaction with prey
function updateWaves(waves, isPredatorWave) {
  for (let i = waves.length - 1; i >= 0; i--) {
    let wave = waves[i];
    wave.expand(); // expand the wave radius
    wave.display(isPredatorWave ? predatorColour : '#A87E1E'); // determine wave colour of predator/prey

    // emit new wave from prey if predator wave intersects with prey
    if (isPredatorWave) {
      objects.forEach(obj => {
        // if current wave intersects with prey + wave has already triggered a response or not
        if (wave.intersects(obj.position) && !wave.triggeredResponse) {
          preyWaves.push(new Wave(obj.position.x, obj.position.y)); // emit wave from prey
          wave.triggeredResponse = true; // fail safe to prevent multiple emissions for one hit
        }
      });
    }
    // remove wave if it gets too big
    if (waves[i].radius > width) {
      waves.splice(i, 1);
    }
  }
}
