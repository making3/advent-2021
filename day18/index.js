const SAMPLE = false;
const inputs = getInputArray(SAMPLE).map((line) => JSON.parse(line));

function addSnailfish(first, second) {
    return [first, second];
}

const EXPLODE_TYPE = {
    DIRECT_CHILD: 'DIRECT_CHILD',
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

        function doLeft() {
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
            } else if (explodeDir === 'right' && exploded[0] > -1) {
                snailfish[0] = exploded[0] + snailfish[0];
                exploded[0] = -1;
            } else if (explodeDir === 'left' && exploded[1] > -1) {
                snailfish[0] = exploded[1] + snailfish[0];
                exploded[1] = -1;
            }

            if (!exploded && left >= 10 && !splitAction) {
                splitAction = () => {
                    snailfish[0] = [Math.floor(left / 2), Math.ceil(left / 2)];
                };
            }
        }
        function doRight() {
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
            } else if (explodeDir === 'right' && exploded[0] > -1) {
                snailfish[1] = exploded[0] + snailfish[1];
                exploded[0] = -1;
            } else if (explodeDir === 'left' && exploded[1] > -1) {
                snailfish[1] = exploded[1] + snailfish[1];
                exploded[1] = -1;
            }
            if (!exploded && right >= 10 && !splitAction) {
                splitAction = () => {
                    snailfish[1] = [
                        Math.floor(right / 2),
                        Math.ceil(right / 2),
                    ];
                };
            }
        }

        let result;
        if (!explodeDir || explodeDir === 'left') {
            result = doLeft() | doRight() | !!explodeDir;
        } else {
            result = doRight() | doLeft() | !!explodeDir;
        }

        return result;
    }

    do {
        exploded = null;
        splitAction = null;
        reduce(snailfish);
        if (!exploded && splitAction) {
            splitAction();
        }
    } while (exploded || splitAction);
}

let total = inputs[0];
for (let i = 1; i < inputs.length; i++) {
    total = addSnailfish(total, inputs[i]);

    reduceSnailfish(total);
}

logAnswer(FIRST, calculateMagnitude(total));

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
