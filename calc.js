const CARB_RATIO = 12;
const CORRECTION_FACTOR = 60;

let runCalc = (targetGlucose, suffix) => {
    let reading = document.getElementById('glucometer-reading').value;
    let carbs = document.getElementById('carb-grams').value;
    reading = parseInt(reading, 10);
    carbs = parseInt(carbs, 10);

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
    runCalc(150, '');
    runCalc(180, '-night');

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

init();