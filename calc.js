let runCalc = function () {
    let reading = document.getElementById('glucometer-reading').value;
    let carbs = document.getElementById('carb-grams').value;
    reading = parseInt(reading, 10);
    carbs = parseInt(carbs, 10);

    let delta = reading - 150;
    document.getElementById('glucose-delta').innerText = delta;
    let cfInsulin = delta / 40;
    cfInsulin = Math.max(cfInsulin, 0);
    cfInsulin = parseFloat(cfInsulin.toFixed(2));
    document.getElementById('cf-insulin').innerText = cfInsulin + ' units';

    let crInsulin = carbs / 12;
    crInsulin = parseFloat(crInsulin.toFixed(2));
    document.getElementById('cr-insulin').innerText = crInsulin + ' units';

    let dosage = cfInsulin + crInsulin;
    let fraction = dosage - Math.trunc(dosage);
    let rounded = Math.floor(dosage);
    if (fraction > 0.3) {
        rounded += 0.5;
    }
    if (fraction > 0.7) {
        rounded += 0.5;
    }
    let text = `${dosage} which rounds to <strong class="text-primary">${rounded}</strong>`;
    document.getElementById('humalog-dosage').innerHTML = text;
};

var btn = document.getElementById('calc-button')
btn.addEventListener('click', runCalc);