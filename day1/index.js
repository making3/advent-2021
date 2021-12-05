const input = getInput();

let depthNumbers = input.split('\n').map((n) => Number(n));
let increasedMeasurements = 0;
for (let i = 1; i < depthNumbers.length; i++) {
    if (depthNumbers[i] > depthNumbers[i - 1]) {
        increasedMeasurements++;
    }
}
logAnswer(FIRST, increasedMeasurements);

increasedMeasurements = 0;
for (let i = 2; i < depthNumbers.length - 1; i++) {
    const A = depthNumbers.slice(i - 2, i + 1).reduce((acc, n) => n + acc, 0);
    const B = depthNumbers.slice(i - 1, i + 2).reduce((acc, n) => n + acc, 0);

    if (B > A) {
        increasedMeasurements++;
    }
}
logAnswer(SECOND, increasedMeasurements);
