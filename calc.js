// Joe's default values
var CARB_RATIO = 15; // grams/U
var CORRECTION_FACTOR = 60; // mg/dL/U
var BG_TARGET = {'morn':120,'work':120,'even':120,'sleep':150}; // Day periods ending in -ing
var BG_CORRECT = 150; // If below this number, don't correct
var UNITS_SI = false; // switch between mg/dL and mmol/L
// These may be implemented later 
var IOB = 0; // Units on board
var LAST_TIME = null; // Time of last bolus
var ACTIVE_INSULIN_TIME = 3; // hours
var enable_RAGE_BOLUS = false; // Enable non-linear calculations  
var enable_REVERSE_CORRECTION = false; 

let runCalc = (targetGlucose, suffix) => {
    let reading = document.getElementById('glucometer-reading').value;
    let carbs = document.getElementById('carb-grams').value;
    reading = parseInt(reading, 10);
    carbs = parseInt(carbs, 10);

    if (reading<=BG_CORRECT) {reading = 0};
    let delta = reading - targetGlucose;
    document.getElementById(`glucose-delta${suffix}`).innerText = delta;
    let cfInsulin = delta / CORRECTION_FACTOR;
    cfInsulin = Math.max(cfInsulin, 0);
    cfInsulin = parseFloat(cfInsulin.toFixed(2));
    document.getElementById(`cf-insulin${suffix}`).innerText = `${cfInsulin} units`;

    let crInsulin = carbs / CARB_RATIO;
    crInsulin = parseFloat(crInsulin.toFixed(2));
    document.getElementById('cr-insulin').innerText = `${crInsulin} units`;

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
    let text = `${dosage} which rounds to <strong class="text-primary">${rounded}</strong>`;
    document.getElementById(`humalog-dosage${suffix}`).innerHTML = text;
};

let runBothCalcs = () => {
    runCalc(BG_TARGET.morn, '');
    runCalc(BG_TARGET.sleep, '-night');

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
};

let init = () => {
    updateDisplayUnits();
};

var btn = document.getElementById('calc-button')
btn.addEventListener('click', runBothCalcs);

var btn = document.getElementById('glucometer-reading')
btn.addEventListener('onchange', runBothCalcs);

var btn = document.getElementById('carb-grams')
btn.addEventListener('onchange', runBothCalcs);

init();
