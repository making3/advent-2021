const input = getInputArray(false);

function create2dArray(size) {
    const arr = [];

    for (let i = 0; i < size; i++) {
        const inner = [];
        for (let k = 0; k < size; k++) {
            inner.push(0);
        }
        arr.push(inner);
    }

    return arr;
}

function iterateInputs(getNewScaryLines) {
    const diagram = create2dArray(1000);

    let scaryLines = 0;
    for (const segment of input) {
        const [from, to] = segment.split('->');
        const [x1, y1] = from
            .trim()
            .split(',')
            .map((n) => parseInt(n, 10));
        const [x2, y2] = to
            .trim()
            .split(',')
            .map((n) => parseInt(n, 10));

        scaryLines = getNewScaryLines(diagram, x1, y1, x2, y2, scaryLines);
    }
    return scaryLines;
}

const firstScaryLines = iterateInputs((diagram, x1, y1, x2, y2, scaryLines) => {
    if (x1 === x2) {
        if (y1 > y2) {
            for (let i = y2; i <= y1; i++) {
                if (++diagram[i][x1] === 2) {
                    scaryLines++;
                }
            }
        } else {
            for (let i = y1; i <= y2; i++) {
                if (++diagram[i][x1] === 2) {
                    scaryLines++;
                }
            }
        }
    } else if (y1 === y2) {
        if (x1 > x2) {
            for (let i = x2; i <= x1; i++) {
                if (++diagram[y2][i] === 2) {
                    scaryLines++;
                }
            }
        } else {
            for (let i = x1; i <= x2; i++) {
                if (++diagram[y2][i] === 2) {
                    scaryLines++;
                }
            }
        }
    }
    return scaryLines;
});

logAnswer(FIRST, firstScaryLines);

const secondScaryLines = iterateInputs(
    (diagram, x1, y1, x2, y2, scaryLines) => {
        if (x1 === x2) {
            if (y1 > y2) {
                for (let i = y2; i <= y1; i++) {
                    if (++diagram[i][x1] === 2) {
                        scaryLines++;
                    }
                }
            } else {
                for (let i = y1; i <= y2; i++) {
                    if (++diagram[i][x1] === 2) {
                        scaryLines++;
                    }
                }
            }
        } else if (y1 === y2) {
            if (x1 > x2) {
                for (let i = x2; i <= x1; i++) {
                    if (++diagram[y2][i] === 2) {
                        scaryLines++;
                    }
                }
            } else {
                for (let i = x1; i <= x2; i++) {
                    if (++diagram[y2][i] === 2) {
                        scaryLines++;
                    }
                }
            }
        } else {
            let x = x1;
            let y = y1;

            while (true) {
                if (++diagram[y][x] === 2) {
                    scaryLines++;
                }

                if (x1 < x2) {
                    x++;
                    if (x > x2) {
                        break;
                    }
                } else {
                    x--;
                    if (x < x2) {
                        break;
                    }
                }
                if (y1 < y2) {
                    y++;
                } else {
                    y--;
                }
            }
        }

        return scaryLines;
    }
);

logAnswer(SECOND, secondScaryLines);
