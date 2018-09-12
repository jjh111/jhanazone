/*"Influence" by John Hanacek
 1/1/2016
 Georgetown Communication, Culture & Technology
 For class: Expressive Computation, taught by Garrison LeMasters
 */

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




function setup() {
  //frameRate(24);

  //extFont(font);

  //cnv = createCanvas(1500, 1000);
  cnv = createCanvas(windowWidth-20, windowHeight-20);

  soundFormats('mp3', 'ogg');
    song = loadSound('assets/27568__suonho__memorymoon-space-blaster-plays.mp3');



  env = new p5.Envelope();
  env.setADSR(attackTime, decayTime, susPercent, releaseTime);
  env.setRange(attackLevel, releaseLevel);


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


		cnv.mousePressed(envAttack);
  }


function touchStarted() {
  if (value === 0) {
    song.play();
    song.setVolume(1);
  } else {
    song.stop();
  }
}


function envAttack(){

  env.triggerAttack();
  carrier.start(); // start oscillating



function mouseReleased() {
  env.triggerRelease();

	carrier.stop();
	//grow = 0;
	  carrier.amp(0.0, 0.002);

}



function draw() {


  // map mouseY to modulator freq between a maximum and minimum frequency
  var modFreq = map(mouseY, 200, 0, modMinFreq, modMaxFreq); //-9

	modulator.freq(modFreq);
//console.log(modFreq);
  //println(modFreq);

  // change the amplitude of the modulator
  // negative amp reverses the sawtooth waveform, and sounds percussive

  var modDepth = map(mouseY, 0, -200, modMinDepth, modMaxDepth); //84
  modulator.amp(modDepth);



  if (mouseIsPressed == true) {
envAttack();
    carrier.amp(1.0, 0.01);
			triOscBaseFreq = triOscBaseFreq -200;
    }
}
}
