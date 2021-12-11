const input = getInputArray(false);

const values = input.map((line) => {
    const [uniquePatterns, outputValue] = line.split('|');

    return {
        uniquePatterns: uniquePatterns
            .trim()
            .split(' ')
            .map((p) => [...p.trim()])
            .filter(Boolean),
        outputValues: outputValue
            .trim()
            .split(' ')
            .map((p) => [...p.trim()])
            .filter(Boolean),
    };
});

let appearances = 0;
for (const { outputValues } of values) {
    for (const values of outputValues) {
        if (
            values.length === 2 ||
            values.length === 3 ||
            values.length === 4 ||
            values.length === 7
        ) {
            appearances++;
        }
    }
}
logAnswer(FIRST, appearances);

let output = 0;
/*
  0(6):   1(2):   2(5):   3:(5)   4:(4)
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....

  5(5):   6(6):   7(3):   8(7):   9(6):
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg
*/

function doesNotIncludeCharacters(a, b) {
    return a.filter((c) => !b.includes(c));
}

function doesNotIncludeCharacter(a, b) {
    return a.find((c) => !b.includes(c));
}

function includesArr(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

function getDecoderMap(allPatterns) {
    const positionMap = {};

    const foundValues = new Array(10);
    const otherPatterns = { 5: [], 6: [] };
    for (let i = 0; i < allPatterns.length; i++) {
        const pattern = allPatterns[i];
        pattern.sort();
        if (pattern.length === 2) {
            foundValues[1] = pattern;
        } else if (pattern.length === 3) {
            foundValues[7] = pattern;
        } else if (pattern.length === 4) {
            foundValues[4] = pattern;
        } else if (pattern.length === 7) {
            foundValues[8] = pattern;
        } else {
            const p = pattern.join('');
            if (p.length === 5) {
                if (!otherPatterns['5'].includes(p)) {
                    otherPatterns['5'].push(p);
                }
            } else if (!otherPatterns['6'].includes(p)) {
                otherPatterns['6'].push(p);
            }
        }
    }

    // Find the top char
    positionMap.top = doesNotIncludeCharacter(foundValues[7], foundValues[1]);
    const [first, second] = foundValues[7].filter(
        (char) => char !== positionMap.top
    );

    // Find #6 -> 1,4,6,7
    const sixIndex = otherPatterns['6'].findIndex((pattern) => {
        if (!pattern.includes(first)) {
            positionMap.right1 = first;
            positionMap.right2 = second;
            return true;
        }
        if (!pattern.includes(second)) {
            positionMap.right1 = second;
            positionMap.right2 = first;
            return true;
        }
        return false;
    });
    foundValues[6] = otherPatterns['6'][sixIndex].split('');
    otherPatterns['6'].splice(sixIndex, 1);

    // Find 2, 3, 5
    otherPatterns['5'].forEach((pattern) => {
        const r1 = pattern.includes(positionMap.right1);
        const r2 = pattern.includes(positionMap.right2);
        if (r1 && r2) {
            foundValues[3] = pattern.split('');
        } else if (r1) {
            foundValues[2] = pattern.split('');
        } else {
            foundValues[5] = pattern.split('');
        }
    });

    const n = doesNotIncludeCharacters(foundValues[2], foundValues[5]);
    positionMap.left2 = n.find((c) => c !== positionMap.right1);

    // Find the last 0, 9
    otherPatterns['6'].forEach((pattern) => {
        if (pattern.includes(positionMap.left2)) {
            foundValues[0] = pattern.split('');
        } else {
            foundValues[9] = pattern.split('');
        }
    });

    return foundValues.reduce((decoder, pattern, i) => {
        decoder[pattern.join('')] = i;
        return decoder;
    }, {});
}

for (const { uniquePatterns, outputValues } of values) {
    const decoder = getDecoderMap([...uniquePatterns, ...outputValues]);

    const f = outputValues.reduce(
        (finalOutput, val) => finalOutput + decoder[val.join('')],
        ''
    );
    output += Number(f);
}

logAnswer(SECOND, output);
