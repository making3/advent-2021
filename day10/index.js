const input = getInputArray(false);
const lines = input.map((line) => line.split(''));

const illegalPoints = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
};
const autocompletePoints = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
};
const brackets = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
};
const openingBrackets = Object.keys(brackets);
const closingBrackets = Object.values(brackets);

let corruptedPoints = 0;
const allAutocompletePoints = [];
for (const line of lines) {
    let incompletePoints = 0;

    const openBrackets = [];

    for (let c of line) {
        if (closingBrackets.includes(c) && doesNotMatch(openBrackets, c)) {
            corruptedPoints = corruptedPoints + illegalPoints[c];
            break;
        }

        if (openingBrackets.includes(c)) {
            openBrackets.push(brackets[c]);
        }
    }

    if (openBrackets.length) {
        openBrackets.reverse();
        for (const openBracket of openBrackets) {
            const point = autocompletePoints[openBracket];

            incompletePoints = incompletePoints * 5 + point;
        }
        allAutocompletePoints.push(incompletePoints);
    }
}

function doesNotMatch(openBrackets, c) {
    if (openBrackets.length === 0) {
        return false;
    }
    if (openBrackets.length && openBrackets[openBrackets.length - 1] === c) {
        openBrackets.pop();
        return false;
    }
    openBrackets.splice(0, openBrackets.length);
    return true;
}

logAnswer(FIRST, corruptedPoints);

allAutocompletePoints.sort((a, b) => a - b);
const half = (allAutocompletePoints.length - 1) / 2;
const winner = allAutocompletePoints[half];
logAnswer(SECOND, winner);
