var CARB_RATIO;
var CORRECTION_FACTOR
var BG_TARGET
var BG_CORRECT
var UNITS_SI
// These may be implemented later 
var IOB
var LAST_TIME
var ACTIVE_INSULIN_TIME
var enable_RAGE_BOLUS
var enable_REVERSE_CORRECTION

if (localStorage.getItem('CARB_RATIO') == null) {
  // default values
  var CARB_RATIO = 15; // grams/U
  var CORRECTION_FACTOR = 60; // mg/dL/U
  var BG_CORRECT = 150; // If below this number, don't correct
  var UNITS_SI = false; // switch between mg/dL and mmol/L
  // These may be implemented later 
  var IOB = 0; // Units on board
  var LAST_TIME = null; // Time of last bolus
  var ACTIVE_INSULIN_TIME = 3; // hours
  var enable_RAGE_BOLUS = false; // Enable non-linear calculations  
  var enable_REVERSE_CORRECTION = false;
} else {
  // Load values
  var CARB_RATIO = localStorage.getItem('CARB_RATIO');
  var CORRECTION_FACTOR = localStorage.getItem('CORRECTION_FACTOR');
  var BG_CORRECT = localStorage.getItem('BG_CORRECT');
  var UNITS_SI = JSON.parse(localStorage.getItem('UNITS_SI'));
  // These may be implemented later 
  var IOB = localStorage.getItem('IOB');
  var LAST_TIME = localStorage.getItem('LAST_TIME');
  var ACTIVE_INSULIN_TIME = localStorage.getItem('ACTIVE_INSULIN_TIME');
  var enable_RAGE_BOLUS = localStorage.getItem('enable_RAGE_BOLUS');
  var enable_REVERSE_CORRECTION = localStorage.getItem('enable_REVERSE_CORRECTION');
}
if (localStorage.getItem('BG_TARGET') == null) {
  var BG_TARGET = 120; // { 'morn': 120, 'work': 120, 'even': 120, 'sleep': 150 } Day periods ending in -ing
} else {
  var BG_TARGET = JSON.parse(localStorage.getItem('BG_TARGET'));
  console.log('resetting')
}

let runCalc = (targetGlucose, suffix) => {
  let reading = document.getElementById('glucometer-reading').value;
  let carbs = document.getElementById('carb-grams').value;
  reading = parseInt(reading, 10) || 0;
  carbs = parseInt(carbs, 10) || 0;

  if (reading <= BG_CORRECT) {
    reading = 0;
    document.getElementById('correct-warn').hidden = false;
  } else { document.getElementById('correct-warn').hidden = true; };
  let delta = reading - targetGlucose;
  document.getElementById(`glucose-delta${suffix}`).innerText = delta;
  let cfInsulin = delta / CORRECTION_FACTOR;
  cfInsulin = Math.max(cfInsulin, 0);
  cfInsulin = parseFloat(cfInsulin.toFixed(2));
  document.getElementById(`cf-insulin${suffix}`).innerText = `${cfInsulin} units`;
  document.getElementById('CFdose').value = cfInsulin;

  let crInsulin = carbs / CARB_RATIO;
  crInsulin = parseFloat(crInsulin.toFixed(2));
  document.getElementById('CRdose').value = crInsulin;


  let dosage = cfInsulin + crInsulin;
  let fraction = dosage - Math.trunc(dosage);
  let rounded = Math.floor(dosage);
  if (fraction > 0.3) {
    rounded += 0.5;
  }
  if (fraction > 0.7) {
    rounded += 0.5;
  }
  dosage = dosage.toFixed(2);
  document.getElementById('dose').value = dosage;
};

let runBothCalcs = () => {
  runCalc(BG_TARGET, '');

  Array.from(document.getElementsByClassName('dosage')).forEach((elt) => {
    elt.classList.remove('invisible');
    elt.classList.add('visible');
  });
};

let updateDisplayUnits = () => {
  Array.from(document.getElementsByClassName('carb-ratio-display')).forEach((elt) => {
    elt.innerHTML = CARB_RATIO;
  });
  Array.from(document.getElementsByClassName('correction-factor-display')).forEach((elt) => {
    elt.innerText = CORRECTION_FACTOR;
  });
  Array.from(document.getElementsByClassName('target-display')).forEach((elt) => {
    elt.innerText = BG_TARGET;
  });
  Array.from(document.getElementsByClassName('correct-above-display')).forEach((elt) => {
    elt.innerText = BG_CORRECT;
  });
};

let init = () => {
  console.log(BG_TARGET)
  document.getElementById('CARB_RATIO').value = CARB_RATIO;
  document.getElementById('CORRECTION_FACTOR').value = CORRECTION_FACTOR;
  document.getElementById('BG_TARGET').value = JSON.stringify(BG_TARGET);
  document.getElementById('BG_CORRECT').value = BG_CORRECT;
  document.getElementById('UNITS_SI').value = UNITS_SI;

  if (UNITS_SI) {
    document.getElementById('UNITS_SI').checked = true;
    document.getElementById('units').innerHTML = "mmol/L";
    let names = document.getElementsByClassName("units"); // get all spans with class name
    for (let name of names) { // loop through the collection
      name.textContent = "mmol/L"; // update the text content
    }
  } else {
    document.getElementById('UNITS_US').checked = true;
    document.getElementById('units').innerHTML = "mg/dL";
    let names = document.getElementsByClassName("units"); // get all spans with class name
    for (let name of names) { // loop through the collection
      name.textContent = "mg/dL"; // update the text content
    }
  }
  updateDisplayUnits();
};

var btn = document.getElementById('calc-button')
btn.addEventListener('click', runBothCalcs);

var gluc = document.getElementById('glucometer-reading')
gluc.addEventListener('blur', runBothCalcs);
gluc.addEventListener('change', runBothCalcs);

var carb = document.getElementById('carb-grams')
carb.addEventListener('blur', runBothCalcs);
carb.addEventListener('change', runBothCalcs);

const updateButton = document.getElementById("settingsbtn");
const cancelButton = document.getElementById("cancel");
const saveButton = document.getElementById("save");
const dialog = document.getElementById("settingsDialog");
dialog.returnValue = "favAnimal";

function openCheck(dialog) {
  if (dialog.open) {
    console.log("Dialog open");
  } else {
    console.log("Dialog closed");
  }
}

// Update button opens a modal dialog
updateButton.addEventListener("click", () => {
  dialog.showModal();
  openCheck(dialog);
});

// Form cancel button closes the dialog box
cancelButton.addEventListener("click", () => {
  dialog.close("animalNotChosen");
  openCheck(dialog);
});

// Form save button closes the dialog box
saveButton.addEventListener("click", () => {
  dialog.close("saving");
  openCheck(dialog);
  localStorage.setItem('CARB_RATIO', document.getElementById('CARB_RATIO').value);
  localStorage.setItem('CORRECTION_FACTOR', document.getElementById('CORRECTION_FACTOR').value);
  localStorage.setItem('BG_TARGET', document.getElementById('BG_TARGET').value);
  localStorage.setItem('BG_CORRECT', document.getElementById('BG_CORRECT').value);
  localStorage.setItem('UNITS_SI', document.getElementById('UNITS_SI').checked);
});

init();
