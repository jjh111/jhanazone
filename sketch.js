/*"Influence" by John Hanacek
 1/1/2016
 Georgetown Communication, Culture & Technology
 For class: Expressive Computation, taught by Garrison LeMasters
 */

var img; //front cutout of person standing
var radius = 0;
var grow = 0;
var alphaVal = 255;
var invAlpha = 0;
var pass = 0;
var flash = 255;
var forwardX = 0;
var forwardY = 0;
var xPos = [3000];
var yPos = [3000];
var s = [3000];
var a = 0;
var b = 0;
var c = 100;
var p = 10;
var value = 0;
var sky = 30;
var mouseIsPressed = false;
var attackLevel = 2.0;
var releaseLevel = 0;
var attackTime = 0.001
var decayTime = 0.3;
var susPercent = 0.2;
var releaseTime = 0.5;

var env, env1, triOsc;

var carrier; // this is the oscillator we will hear
var modulator; // this oscillator will modulate the frequency of the carrier

var analyzer; // we'll use this visualize the waveform

// the carrier frequency pre-modulation
var carrierBaseFreq = 220;
var triOscBaseFreq = 1000;

// min/max ranges for modulator
var modMaxFreq = 0;
var modMinFreq = -20;
var modMaxDepth = 150;
var modMinDepth = 20;



var NUMSINES = 20; // how many of these things can we do at once?
var sines = new Array(NUMSINES); // an array to hold all the current angles
var rad; // an initial radius value for the central sine
var i; // a counter variable

// play with these to get a sense of what's going on:
var fund = 0.005; // the speed of the central sine
var ratio = 0.2; // what multiplier for speed is each additional sine?
var alpha = 50; // how opaque is the tracing system

var trace = false; // are we tracing?



function setup() {
  frameRate(24);

  //extFont(font);

  //cnv = createCanvas(1500, 1000);

  soundFormats('mp3', 'ogg');
    song = loadSound('assets/27568__suonho__memorymoon-space-blaster-plays.mp3');
cnv = createCanvas(windowWidth-20, windowHeight-20);
font = loadFont('assets/AvenirNext-Bold.ttf');


img = loadImage("/assets/FSalone.png");
  noCursor();
	//cursor(CROSS, [1], [1])
  fill(0);
  noStroke();
  rect(0, 0, width, height);
  starpoints(); //drawing star points

  env = new p5.Envelope();
  env.setADSR(attackTime, decayTime, susPercent, releaseTime);
  env.setRange(attackLevel, releaseLevel);

  triOsc = new p5.Oscillator('triangle');
  triOsc.amp(env-alphaVal);

  triOsc.freq(triOscBaseFreq);




  carrier = new p5.Oscillator('sine');
  carrier.amp(0); // set amplitude
  carrier.freq(carrierBaseFreq); // set frequency


  // try changing the type to 'square', 'sine' or 'triangle'
  modulator = new p5.Oscillator('sine');
  modulator.start();

  // add the modulator's output to modulate the carrier's frequency
  modulator.disconnect();
  carrier.freq(modulator);



  // create an FFT to analyze the audio
  analyzer = new p5.FFT();

  rad = height / 4; // compute radius for central circle


  for (var i = 0; i < sines.length; i++) {
    sines[i] = PI; // start EVERYBODY facing NORTH

		cnv.mousePressed(envAttack);
  }
}

function touchStarted() {
  if (value === 0) {
    song.play();
  } else {
    song.stop();
  }
}


function envAttack(){

  env.triggerAttack();
  carrier.start(); // start oscillating
	explosion(); //calling the retro looking explosion circles

}
function cutout(){image(img, 0, height, img.width, img.height);
}

function mouseReleased() {
  env.triggerRelease();
	triOsc.stop();
	carrier.stop();
	//grow = 0;
	  carrier.amp(0.0, 0.002);
  radius = 0.01; //reset explosion for next mousepressed event
  alphaVal = 255;
  invAlpha = 0;
  sky = 60;
  grow = random(2, 12);
  pass = 12;
  flash = 255;
  fill(255, random(235, 255));
  ellipse(mouseX, mouseY, grow, grow);


	//tesseract = new Tesseract();
}



function draw() {
  fill(255);
song.setVolume(0.1);
    for (var i = 0; i < windowWidth*2; i++) {
      noStroke();
      ellipse(xPos[i], yPos[i], s[i], s[i]);
  }
  fill(0, sky);
  noStroke();
  rect(0, 0, width, height);


  fill(110, 14, 105, 5);
  noStroke();
  rect(0, 0, width, height);


  var locY = (mouseY / height - 0.5) * (-2);
  var locX = (mouseX / width - 0.5) * 2;

//console.log(locY);
	//console.log(triOscBaseFreq);


  // map mouseY to modulator freq between a maximum and minimum frequency
  var modFreq = map(mouseY, 200, 0, modMinFreq, modMaxFreq); //-9

	modulator.freq(modFreq);
//console.log(modFreq);
  //println(modFreq);

  // change the amplitude of the modulator
  // negative amp reverses the sawtooth waveform, and sounds percussive
  //
  var modDepth = map(mouseY, 0, -200, modMinDepth, modMaxDepth); //84
  modulator.amp(modDepth);
  //println(modDepth);
  //image(img, 0, 0, img.width / 2, img.height / 2);




  function drawWords(x) {
  // The text() function needs three parameters:
  // the text to draw, the horizontal position,
  // and the vertical position
  fill(0);
  text("ichi", x, 80);

  fill(65);
  text("ni", x, 150);

  fill(190);
  text("san", x, 220);

  fill(255);
  text("shi", x, 290);
  }


  if (mouseIsPressed == true) {

    carrier.amp(1.0, 0.01);
    grow = pow(pass++, 6);
    for (var i = 0; i < 25; i = i + 1); {
      alphaVal = alphaVal - 1;
      invAlpha = invAlpha + 1;
      flash = flash - 70;
      sky = sky - 1;
			triOscBaseFreq = triOscBaseFreq -200;
    }
    drawCircle();
    explosion(); //calling the retro looking explosion circles
    tracker(); //twinkles
    //image(img, 0, 0, img.width / 2, img.height / 2);
    fill(255, invAlpha - 10);

    ellipse(mouseX, mouseY, 10, 10);



    if (!trace) {

      stroke(255); // black pen
      noFill(); // don't fill


			/*
	tesseract.display();
			push();


  if (mouseX < width/2) tesseract.turn(0, 1, .01);
  if (mouseY < height/2) tesseract.turn(0, 2, .01);
  if (mouseY == height/2 ) tesseract.turn(1, 2, .01);
  if (mouseX > width/2) tesseract.turn(0, 3, .01);
  if (mouseY > height/2) tesseract.turn(1, 3, .01);
  if (mouseX == width/2) tesseract.turn(2, 3, .01);
	*/

}
    }


/*
    // MAIN ACTION
    push(); // start a transformation matrix
    translate(mouseX, mouseY); // move to middle of screen

    for (var i = 0; i < sines.length; i++) {
      var erad = 0; // radius for small "point" within circle... this is the 'pen' when tracing
      // setup for tracing
      if (trace) {
        stroke(0, 0, 255 * (float(i) / sines.length), alpha); // blue
        fill(255); // also, um, blue
        erad = 5.0 * (1.0 - float(i) / sines.length); // pen width will be related to which sine
      }
      var radius = rad / (i + 1); // radius for circle itself
      rotate(sines[i]); // rotate circle
      if (!trace) ellipse(0, 0, radius * 2, radius * 2); // if we're simulating, draw the sine
      push(); // go up one level
      translate(0, radius); // move to sine edge
      if (!trace) ellipse(0, 0, 5, 5); // draw a little circle
      if (trace) ellipse(0, 0, erad, erad); // draw with erad if tracing
      pop(); // go down one level
      //translate(0, radius); // move into position for next sine
      sines[i] = (sines[i] + (fund + (fund * i * ratio))) % TWO_PI; // update angle based on fundamental
    }

    pop(); // pop down final transformation
*/
	/*
function Tesseract {
  float([][][] lines);
  float mouseX, mouseY, z, w, perspZ, perspW, size;

  Tesseract() {
    size=tessSize;
    z=5;
    w=1;
    perspZ=4;
    perspW=1;

    float[][][] temp={
      {{1, 1, 1, 1}, {-1, 1, 1, 1}},
      {{1, 1, 1, 1}, { 1, -1, 1, 1}},
      {{1, 1, 1, 1}, { 1, 1, -1, 1}},
      {{1, 1, 1, 1}, { 1, 1, 1, -1}},

      {{-1, -1, 1, 1}, { 1, -1, 1, 1}},
      {{-1, -1, 1, 1}, {-1, 1, 1, 1}},
      {{-1, -1, 1, 1}, {-1, -1, -1, 1}},
      {{-1, -1, 1, 1}, {-1, -1, 1, -1}},

      {{-1, 1, -1, 1}, { 1, 1, -1, 1}},
      {{-1, 1, -1, 1}, {-1, -1, -1, 1}},
      {{-1, 1, -1, 1}, {-1, 1, 1, 1}},
      {{-1, 1, -1, 1}, {-1, 1, -1, -1}},

      {{-1, 1, 1, -1}, { 1, 1, 1, -1}},
      {{-1, 1, 1, -1}, {-1, -1, 1, -1}},
      {{-1, 1, 1, -1}, {-1, 1, -1, -1}},
      {{-1, 1, 1, -1}, {-1, 1, 1, 1}},

      {{1, -1, -1, 1}, {-1, -1, -1, 1}},
      {{1, -1, -1, 1}, { 1, 1, -1, 1}},
      {{1, -1, -1, 1}, { 1, -1, 1, 1}},
      {{1, -1, -1, 1}, { 1, -1, -1, -1}},

      {{1, -1, 1, -1}, {-1, -1, 1, -1}},
      {{1, -1, 1, -1}, { 1, 1, 1, -1}},
      {{1, -1, 1, -1}, { 1, -1, -1, -1}},
      {{1, -1, 1, -1}, { 1, -1, 1, 1}},

      {{1, 1, -1, -1}, {-1, 1, -1, -1}},
      {{1, 1, -1, -1}, { 1, -1, -1, -1}},
      {{1, 1, -1, -1}, { 1, 1, 1, -1}},
      {{1, 1, -1, -1}, { 1, 1, -1, 1}},

      {{-1, -1, -1, -1}, { 1, -1, -1, -1}},
      {{-1, -1, -1, -1}, {-1, 1, -1, -1}},
      {{-1, -1, -1, -1}, {-1, -1, 1, -1}},
      {{-1, -1, -1, -1}, {-1, -1, -1, 1}}};

    lines=temp;
  }

  }
	*/
  function keyReleased() {
    if (key == ' ') {
      trace = !trace;
    }
  }
}





//drawing explosion
function drawCircle() {
  //translate(width/2, height/3); //centers explosion
  fill(255, flash);
  ellipse(mouseX, mouseY, grow, grow);
}





function explosion() {

  stroke(244, 233, 202, alphaVal - 100);
  strokeWeight(10);

  fill(244, 233, 202, alphaVal - 70);
  ellipse(mouseX, mouseY, radius * sin(radius++), radius * sin(radius++));

  fill(172, 227, 219, alphaVal - 70);
  ellipse(mouseX, mouseY, radius * 2 * cos(radius++), radius * 2 * cos(radius++));

  fill(102, 45, 145, alphaVal - 200);
  ellipse(mouseX, mouseY, radius * 8, radius * 8);

  sin(radius++); //these on together give a wave pattern to explosion
  sin(radius++); //comment out one of these to make explosion circular
}

function starpoints() {
  strokeWeight(3); //protecting stars from drawcircle strokeweight
  //locations of stars
  for (var i = 0; i < 2500; i++) {
    xPos[i] = random(0, width);
  }
  for (var i = 0; i < 2500; i++) {
    yPos[i] = random(0, height);
  }

  //size of stars
  for (var i = 0; i < 2500; i++) {
    s[i] = random(0, 5);
  }


}

//draws twinkles

function tracker() {
  strokeWeight(3); //protecting from drawcircle strokeweight
  noStroke();
  line(a, b, c, a);
  a = a + 3;
  if (a == 600) {
    a = 0;
    c = c + 100;
    b = b + 100;
  }

  stroke(244, 233, 202, invAlpha);
  for (var i = 0; i < 250; i++) {
    line(xPos[i] + p, yPos[i], xPos[i], yPos[i]);
    line(xPos[i], yPos[i] + p, xPos[i], yPos[i]);
    line(xPos[i], yPos[i], xPos[i] - p, yPos[i]);
    line(xPos[i], yPos[i], xPos[i], yPos[i] - p);
    if (a > yPos[i] - 25) {
      p = 5;
    }
    if (a < yPos[i] + 25) {
      p = 5;
    }
    if (a < yPos[i] - 25) {
      p = 0;
    }
    if (a > yPos[i] + 25) {
      p = 0;
    }
    i = i + 1;
  }

}
