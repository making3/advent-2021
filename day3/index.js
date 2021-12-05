const input = getInputArray(false);

let gammaAcc = [];
for (let i = 0; i < input.length; i++) {
    const value = input[i];
    for (let k = 0; k < value.length; k++) {
        const bit = Number(value[k]);
        gammaAcc[k] = gammaAcc[k] || { 0: 0, 1: 0 };

        if (bit === 1) {
            gammaAcc[k]['1']++;
        } else {
            gammaAcc[k]['0']++;
        }
    }
}

let gamma = '';
let epsilon = '';
for (let i = 0; i < gammaAcc.length; i++) {
    if (gammaAcc[i]['1'] >= gammaAcc[i]['0']) {
        gamma = `${gamma}1`;
        epsilon = `${epsilon}0`;
    } else {
        gamma = `${gamma}0`;
        epsilon = `${epsilon}1`;
    }
}
let g = parseInt(gamma, 2);
let e = parseInt(epsilon, 2);

// gamma = 10110, or 22 in decimal
// epsilon = 01001, or 9 in decimal
// multiply 9 * 22 = 198
logAnswer(FIRST, g * e); // 198

function foo(list, bitPosition, w) {
    if (list.length === 1 || bitPosition > list[0].length) {
        return list[0];
    }

    let ones = [];
    let zeros = [];

    for (let i = 0; i < list.length; i++) {
        const value = list[i];
        const b = Number(value[bitPosition]);
        if (b === 1) {
            ones.push(value); // all numbers starting with 1
        } else {
            zeros.push(value); // all numbers starting with 0
        }
    }

    const ogen = ones.length >= zeros.length ? ones : zeros;
    const co2 = ones.length >= zeros.length ? zeros : ones;

    if (w === 'ogen') {
        return foo(ogen, bitPosition + 1, w);
    } else if (w === 'co2') {
        return foo(co2, bitPosition + 1, w);
    }
    return [
        parseInt(foo(ogen, bitPosition + 1, 'ogen'), 2),
        parseInt(foo(co2, bitPosition + 1, 'co2'), 2),
    ];
}

const [oxyGenRating, co2ScrubberRating] = foo(input, 0);

logAnswer(SECOND, oxyGenRating * co2ScrubberRating);
