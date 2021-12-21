const SAMPLE = true;
const inputs = getInputArray(SAMPLE).map((line) => JSON.parse(line));

function addSnailfish(first, second) {
    return [first, second];
}

const EXPLODE_TYPE = {
    DIRECT_CHILD: 'DIRECT_CHILD',
    DESCENDENT: 'DESCENDENT',
};

function reduceSnailfish(snailfish) {
    let exploded = null;
    let splitAction = null;

    function reduce(snailfish, level = 0, explodeDir = null) {
        if (exploded && exploded[0] === -1 && exploded[1] === -1) {
            // Short circuit
            return;
        }
        if (level === 4 && !exploded) {
            exploded = snailfish;
            return EXPLODE_TYPE.DIRECT_CHILD;
        }

        const [left, right] = snailfish;

        if (!exploded && left >= 10 && !splitAction) {
            splitAction = () => {
                snailfish[0] = [Math.floor(left / 2), Math.ceil(left / 2)];
            };
        }
        if (!exploded && right >= 10 && !splitAction) {
            splitAction = () => {
                snailfish[1] = [Math.floor(right / 2), Math.ceil(right / 2)];
            };
        }

        if (Array.isArray(left)) {
            const result = reduce(left, level + 1, explodeDir);
            if (result === EXPLODE_TYPE.DIRECT_CHILD) {
                snailfish[0] = 0;
            }
            if (result) {
                if (exploded[1] > -1) {
                    if (Array.isArray(right)) {
                        reduce(right, level + 1, 'left');
                    } else {
                        snailfish[1] = exploded[1] + snailfish[1];
                        exploded[1] = -1;
                    }
                }
                return true;
            }
        } else if (explodeDir === 'left' && exploded[1] > -1) {
            snailfish[0] = exploded[1] + snailfish[0];
            exploded[1] = -1;
        } else if (explodeDir === 'right' && exploded[0] > -1) {
            snailfish[0] = exploded[0] + snailfish[0];
            exploded[0] = -1;
        }

        if (Array.isArray(right)) {
            const result = reduce(right, level + 1, explodeDir);
            if (result === EXPLODE_TYPE.DIRECT_CHILD) {
                snailfish[1] = 0;
            }
            if (result) {
                if (exploded[0] > -1) {
                    if (Array.isArray(left)) {
                        reduce(left, level + 1, 'right');
                    } else {
                        snailfish[0] = exploded[0] + snailfish[0];
                        exploded[0] = -1;
                    }
                }
                return true;
            }
        } else if (explodeDir === 'left' && exploded[1] > -1) {
            snailfish[1] = exploded[1] + snailfish[1];
            exploded[1] = -1;
        } else if (explodeDir === 'right' && exploded[0] > -1) {
            snailfish[1] = exploded[0] + snailfish[1];
            exploded[0] = -1;
        }

        return !!explodeDir;
    }

    do {
        // console.log('do', JSON.stringify(snailfish));
        // console.log('doex', exploded);
        exploded = null;
        explodeDir = null;
        splitAction = null;
        reduce(snailfish);
        if (exploded) {
            // console.log('explode');
        } else if (splitAction) {
            splitAction();
            // console.log('split');
        }
        // console.log();
    } while (exploded || splitAction);
}
// let ex = [[[[[9, 8], 1], 2], 3], 4];
// console.log(reduceSnailfish(ex)); // [[[[0,9],2],3],4]
// console.log(JSON.stringify(ex));

// console.log();
// ex = [7, [6, [5, [4, [3, 2]]]]];
// console.log(reduceSnailfish(ex)); //[7,[6,[5,[7,0]]]]
// console.log(JSON.stringify(ex));

// console.log();
// ex = [[6, [5, [4, [3, 2]]]], 1];
// console.log(reduceSnailfish(ex)); //[[6,[5,[7,0]]],3]
// console.log(JSON.stringify(ex));

// console.log();
let ex = [
    [3, [2, [1, [7, 3]]]],
    [6, [5, [4, [3, 2]]]],
];
console.log(reduceSnailfish(ex)); //[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]
console.log(JSON.stringify(ex));
console.log();
// console.log(reduceSnailfish(ex)); //[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]
// console.log(JSON.stringify(ex));

const a = addSnailfish(
    [
        [[[4, 3], 4], 4],
        [7, [[8, 4], 9]],
    ],
    [1, 1]
);
// reduceSnailfish(a);
// console.log('result', JSON.stringify(a));

// let total = inputs[0];
// for (let i = 1; i < inputs.length; i++) {
//     total = addSnailfish(total, inputs[i]);
//     reduceSnailfish(total);
//     console.log('do', JSON.stringify(total));
// }

// logAnswer(FIRST, calculateMagnitude(total));

// console.log(
//     calculateMagnitude([
//         [
//             [
//                 [6, 6],
//                 [7, 6],
//             ],
//             [
//                 [7, 7],
//                 [7, 0],
//             ],
//         ],
//         [
//             [
//                 [7, 7],
//                 [7, 7],
//             ],
//             [
//                 [7, 8],
//                 [9, 9],
//             ],
//         ],
//     ])
// );

function calculateMagnitude(finalSum) {
    let left, right;
    if (Array.isArray(finalSum[0])) {
        left = calculateMagnitude(finalSum[0]);
    } else {
        left = finalSum[0];
    }
    if (Array.isArray(finalSum[1])) {
        right = calculateMagnitude(finalSum[1]);
    } else {
        right = finalSum[1];
    }

    return left * 3 + right * 2;
}

// const a = [
//     [
//         [[0, 7], 4],
//         [
//             [7, 8],
//             [0, [6, 7]],
//         ],
//     ],
//     [1, 1],
// ];