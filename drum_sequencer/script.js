// DOM elements
const triggers = document.querySelectorAll(".trigger");
const pads = document.querySelectorAll(".pad");
const strips = document.querySelectorAll(".control-strip");
const sounds = document.querySelectorAll("audio");
const gainKnobs = document.querySelectorAll(".vol");
const panKnobs = document.querySelectorAll(".pan");
const rateKnobs = document.querySelectorAll(".tune");
const bigKnob = document.querySelector(".big-knob");
const playBtn = document.querySelector(".play");
const tempoSlider = document.querySelector(".tempo");
const trigBeats = document.querySelectorAll(".trigger-beat");

// helper functions
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const scale = (num, in_min, in_max, out_min, out_max) => {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};
const tempo = () => 60000 / tempoSlider.value / 2;

// state vars
let mouseDown = false;
let currentSoundID = null;
let currentKnobID = null;
let currentKnobType = null;
let mousePositionY = 0;
let currentRotation = 0;
let knobMax = 128;
let gainMax = 2;
let panMax = 1;
let seqRunning = false;
let currentPad = "bd";

const knobStates = ["230deg", "290deg", "360deg", "70deg", "125deg"];
const gainStates = [0.0, 0.25, 0.5, 0.75, 1.0];

// set up the audio streams/pans/gains/rates
const audioContext = new AudioContext();
audioContext.resume();
const bd = audioContext.createMediaElementSource(sounds[0]);
const sd = audioContext.createMediaElementSource(sounds[1]);
const cp = audioContext.createMediaElementSource(sounds[2]);
const rs = audioContext.createMediaElementSource(sounds[3]);
const lt = audioContext.createMediaElementSource(sounds[4]);
const ht = audioContext.createMediaElementSource(sounds[5]);
const ch = audioContext.createMediaElementSource(sounds[6]);
const oh = audioContext.createMediaElementSource(sounds[7]);
const cy = audioContext.createMediaElementSource(sounds[8]);

const bdGain = audioContext.createGain();
const sdGain = audioContext.createGain();
const cpGain = audioContext.createGain();
const rsGain = audioContext.createGain();
const ltGain = audioContext.createGain();
const htGain = audioContext.createGain();
const chGain = audioContext.createGain();
const ohGain = audioContext.createGain();
const cyGain = audioContext.createGain();
const masterGain = audioContext.createGain();

const bdPanner = audioContext.createStereoPanner();
const sdPanner = audioContext.createStereoPanner();
const cpPanner = audioContext.createStereoPanner();
const rsPanner = audioContext.createStereoPanner();
const ltPanner = audioContext.createStereoPanner();
const htPanner = audioContext.createStereoPanner();
const chPanner = audioContext.createStereoPanner();
const ohPanner = audioContext.createStereoPanner();
const cyPanner = audioContext.createStereoPanner();

bd.connect(bdGain).connect(bdPanner).connect(masterGain);
sd.connect(sdGain).connect(sdPanner).connect(masterGain);
cp.connect(cpGain).connect(cpPanner).connect(masterGain);
rs.connect(rsGain).connect(rsPanner).connect(masterGain);
lt.connect(ltGain).connect(ltPanner).connect(masterGain);
ht.connect(htGain).connect(htPanner).connect(masterGain);
ch.connect(chGain).connect(chPanner).connect(masterGain);
oh.connect(ohGain).connect(ohPanner).connect(masterGain);
cy.connect(cyGain).connect(cyPanner).connect(masterGain);
masterGain.connect(audioContext.destination);

// sequencer data
const sequence = {
  bd: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  sd: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  cp: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  rs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  lt: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ht: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ch: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  oh: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  cy: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

function playSequence(tempo) {
  idxSEQ = 0;

  let seqInterval = setInterval(() => {
    trigBeats.forEach((beat) => {
      beat.classList.remove("beat");
    });
    trigBeats[idxSEQ].classList.add("beat");

    if (seqRunning === true) {
      sounds.forEach(function (sound, idx) {
        const drum = sound.className;
        if (sequence[`${drum}`][idxSEQ] === 1) {
          if (sounds[idx].currentTime !== 0) {
            sounds[idx].pause();
            sounds[idx].currentTime = 0;
          }

          sounds[idx].play();
        }
      });

      if (idxSEQ == 15) {
        idxSEQ = -1;
      }

      idxSEQ++;
    } else {
      clearInterval(seqInterval);
      trigBeats.forEach((beat) => {
        beat.classList.remove("beat");
      });
    }
  }, tempo);
}

// functions
function getPanner(s) {
  switch (s) {
    case "bd":
      return bdPanner;
      break;
    case "sd":
      return sdPanner;
      break;
    case "lt":
      return ltPanner;
      break;
    case "ht":
      return htPanner;
      break;
    case "rs":
      return rsPanner;
      break;
    case "cp":
      return cpPanner;
      break;
    case "cy":
      return cyPanner;
      break;
    case "oh":
      return ohPanner;
      break;
    case "ch":
      return chPanner;
      break;
    default:
      return null;
  }
}

function getGain(s) {
  switch (s) {
    case "bd":
      return bdGain;
      break;
    case "sd":
      return sdGain;
      break;
    case "lt":
      return ltGain;
      break;
    case "ht":
      return htGain;
      break;
    case "rs":
      return rsGain;
      break;
    case "cp":
      return cpGain;
      break;
    case "cy":
      return cyGain;
      break;
    case "oh":
      return ohGain;
      break;
    case "ch":
      return chGain;
      break;
    case "master":
      return masterGain;
    default:
      return null;
  }
}

function knobTurn(e) {
  currentSoundID = this.parentElement.parentElement.id;
  currentKnobType = this.id;
  currentKnobID = this;

  mousePositionY = e.clientY;
  mouseDown = true;
  currentRotation = parseInt(window.getComputedStyle(currentKnobID).rotate);
}

function bigKnobTurn(e) {
  currentSoundID = this.id;
  currentKnobType = "gain";
  currentKnobID = this;

  mousePositionY = e.clientY;
  mouseDown = true;
  currentRotation = parseInt(window.getComputedStyle(currentKnobID).rotate);
}

function rotationChange(e) {
  if (mouseDown) {
    if (currentKnobID === bigKnob) {
      newRotation = clamp(
        -(e.clientY - mousePositionY) * 1.5 + currentRotation,
        -(knobMax + 20),
        knobMax + 20
      );

      currentKnobID.style.rotate = `${newRotation}deg`;
    } else {
      newRotation = clamp(
        -(e.clientY - mousePositionY) * 2.5 + currentRotation,
        -knobMax,
        knobMax
      );

      currentKnobID.style.rotate = `${newRotation}deg`;
    }

    valueChange();
  }
}

function valueChange() {
  let currentNode;

  if (currentKnobType === "gain") {
    currentNode = getGain(currentSoundID);
    let param = scale(newRotation, -knobMax, knobMax, 0.145, gainMax);
    currentNode.gain.value = param;
  } else if (currentKnobType === "pan") {
    currentNode = getPanner(currentSoundID);
    let param = scale(newRotation, -knobMax, knobMax, -panMax, panMax);
    currentNode.pan.value = param;
  } else if (currentKnobID === "rate") {
    console.log("rate... TODO");
  }
}

// preload all the sounds
sounds.forEach((sound) => {
  sound.preload = true;
  sound.volume = gainStates[2];
});

// event listeners
playBtn.addEventListener("mousedown", () => {
  if (seqRunning === false) {
    seqRunning = true;
    playSequence(tempo());
    playBtn.innerHTML = "Stop";
  } else {
    seqRunning = false;
    playBtn.innerHTML = "Play";
  }

  playBtn.classList.toggle("playing");
});

// set up pads to play sounds
pads.forEach((pad) => {
  pad.addEventListener("mousedown", () => {
    const soundID = pad.id;
    const audio = document.querySelector("." + soundID);
    currentPad = pad.id;

    if (audio.currentTime !== 0) {
      audio.pause();
      audio.currentTime = 0;
    }

    audio.play();

    if (!pad.classList.contains("selected")) {
      pads.forEach((pad) => {
        pad.classList.remove("selected");
      });
      pad.classList.add("selected");
    }

    // update the triggers for the new pad
    triggers.forEach((trigger) => {
      const indicator = trigger.children[0];
      const seqNum = parseInt(trigger.id.replace("t", ""));

      // turn off all indicators
      indicator.classList.remove("trig-on");
      if (sequence[`${currentPad}`][seqNum - 1] === 1) {
        indicator.classList.add("trig-on");
      }
    });
  });
});

strips.forEach((strip) => {
  const knobs = strip.querySelectorAll(".knob");

  knobs.forEach((knob) => {
    knob.addEventListener("mousedown", knobTurn);
    knob.addEventListener("dblclick", () => {
      currentKnobID.style.rotate = `${0}deg`;
      newRotation = parseInt(currentKnobID.style.rotate);
      valueChange();
    });
  });
});

window.addEventListener("mousemove", rotationChange);

// check for mouse up event
window.addEventListener("mouseup", () => {
  mouseDown = false;
});

// turn on/off trigger lights when pressed
triggers.forEach((trigger) => {
  trigger.addEventListener("mousedown", () => {
    const indicator = trigger.children[0];
    indicator.classList.toggle("trig-on");

    const seqNum = parseInt(trigger.id.replace("t", ""));

    if (sequence[`${currentPad}`][seqNum - 1] === 1) {
      sequence[`${currentPad}`][seqNum - 1] = 0;
    } else if (sequence[`${currentPad}`][seqNum - 1] === 0) {
      sequence[`${currentPad}`][seqNum - 1] = 1;
    }
  });
});

// big volume knob
bigKnob.addEventListener("mousedown", bigKnobTurn);
bigKnob.addEventListener("dblclick", () => {
  currentKnobID.style.rotate = `${0}deg`;
  newRotation = parseInt(currentKnobID.style.rotate);
  valueChange();
});
