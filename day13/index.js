const folds = [];

const rows = {};
const cols = {};
getInputArray(false)
    .filter(Boolean)
    .forEach((line) => {
        if (line.startsWith('fold')) {
            folds.push(line.substring(11).split('='));
        } else {
            const [col, row] = line.split(',');

            if (!(col in cols)) {
                cols[col] = new Set();
            }
            if (!(row in rows)) {
                rows[row] = new Set();
            }

            cols[col].add(row);
            rows[row].add(col);
        }
    }, []);

let rowLength = Math.max(...Object.keys(rows));
let colLength = Math.max(...Object.keys(cols));

function fold(type, index) {
    if (type === 'y') {
        Object.keys(rows)
            .filter((r) => Number(r) > index)
            .forEach((row) => {
                const newRow = rowLength - row;
                if (!(newRow in rows)) {
                    rows[newRow] = new Set();
                }

                rows[row].forEach((col) => {
                    rows[newRow].add(col);

                    cols[col].delete(row);
                    cols[col].add(newRow.toString());
                });

                delete rows[row];
            });
        rowLength = index - 1;
    } else {
        Object.keys(cols)
            .filter((c) => Number(c) > index)
            .forEach((col) => {
                const newCol = colLength - col;
                if (!(newCol in cols)) {
                    cols[newCol] = new Set();
                }

                cols[col].forEach((row) => {
                    cols[newCol].add(row);

                    rows[row].delete(col);
                    rows[row].add(newCol.toString());
                });

                delete cols[col];
            });
        colLength = index - 1;
    }
}

function print() {
    let dots = '\n';
    for (let i = 0; i < rowLength + 1; i++) {
        for (let k = 0; k < colLength + 1; k++) {
            if (rows[i]?.has(k.toString())) {
                dots = dots + '█';
            } else {
                dots = dots + '░';
            }
        }

        if (i < rowLength) {
            dots = dots + '\n';
        }
    }
    return dots;
}

for (let i = 0; i < folds.length; i++) {
    const [type, index] = folds[i];
    fold(type, Number(index));

    if (i === 0) {
        const rowEntries = Object.values(rows).reduce(
            (total, s) => s.size + total,
            0
        );
        logAnswer(FIRST, rowEntries);
    }
}

logAnswer(SECOND, print());
