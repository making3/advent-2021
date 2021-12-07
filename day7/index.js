const input = getInput(false);

let crabs = input
    .split(',')
    .filter(Boolean)
    .map((n, i) => Number(n));

let fuelSpent = -1;
let cheapest = -1;
for (let i = 0; i < crabs.length; i++) {
    let f = 0;
    for (let j = 0; j < crabs.length; j++) {
        f += Math.abs(crabs[j] - crabs[i]);
    }
    if (fuelSpent === -1 || f < fuelSpent) {
        cheapest = crabs[i];
        fuelSpent = f;
    }
}

console.log('cheapest', cheapest);
logAnswer(FIRST, fuelSpent);
console.log();

let cache = {};
function calc(i) {
    if (i === 0) {
        return 0;
    }
    if (i === 1) {
        return 1;
    }
    if (!(i in cache)) {
        cache[i] = i + calc(i - 1);
    }

    return cache[i];
}

function getDistance(a, b) {
    const diff = Math.abs(a - b);

    return calc(diff);
}

fuelSpent = -1;
cheapest = -1;
for (let i = 0; i < crabs.length; i++) {
    let f = 0;
    for (let j = 0; j < crabs.length; j++) {
        f += getDistance(crabs[j], i);
    }
    if (fuelSpent === -1 || f < fuelSpent) {
        cheapest = crabs[i];
        fuelSpent = f;
    }
}

console.log('cheapest', cheapest);
logAnswer(SECOND, fuelSpent);
