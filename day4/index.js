const input = getInputArray(false);
const drawnNumbers = input[0].split(',');

class Combination {
    constructor() {
        this.keys = [];
    }
    add(key) {
        this.keys.push(key);
    }
    remove(key) {
        const i = this.keys.indexOf(key);
        this.keys.splice(i, 1);
    }
    isEmpty() {
        return this.keys.length === 0;
    }
}

class Board {
    constructor() {
        this.keyMap = {};
        this.board = [];
        this.combinations = [];

        this.currentRow = 0;
        this.rowCombinations = [
            new Combination(),
            new Combination(),
            new Combination(),
            new Combination(),
            new Combination(),
        ];
        this.columnCombinations = [
            new Combination(),
            new Combination(),
            new Combination(),
            new Combination(),
            new Combination(),
        ];
    }

    addRow(keys) {
        this.board.push(keys);
        for (let i = 0; i < keys.length; i++) {
            const rowCombo = this.rowCombinations[this.currentRow];
            rowCombo.add(keys[i]);

            this.columnCombo = this.columnCombinations[i];
            this.columnCombo.add(keys[i]);
            this.addKeyToMap(keys[i], rowCombo, this.columnCombo);
        }

        this.currentRow++;
    }

    addKeyToMap(key, rowCombo, columnCombo) {
        this.keyMap[key] = () => {
            rowCombo.remove(key);
            columnCombo.remove(key);
        };
    }

    buildCombinations() {
        this.combinations = this.columnCombinations.concat(this.combinations);
        this.combinations = this.rowCombinations.concat(this.combinations);
    }

    callNumber(num) {
        if (num in this.keyMap) {
            this.keyMap[num]();
        }

        delete this.keyMap[num];
    }

    hasWinner() {
        return this.combinations.some((c) => c.isEmpty());
    }
}

function buildBoards() {
    const boards = [new Board()];

    let boardIndex = 0;
    for (let i = 2; i < input.length; i++) {
        const row = input[i].trim();
        if (!row) {
            boardIndex++;
            boards.push(new Board());
            continue;
        }

        const numbers = row
            .split(' ')
            .filter(Boolean)
            .map((n) => Number(n));
        boards[boardIndex].addRow(numbers);
    }

    for (const board of boards) {
        board.buildCombinations();
    }

    return boards;
}

function findWinnerPart1(boards) {
    for (let num of drawnNumbers) {
        for (let board of boards) {
            board.callNumber(num);
            if (board.hasWinner()) {
                return [num, board];
            }
        }
    }
}
function createAnswerFromWinner(board, lastNumber) {
    const remainingSum = Object.keys(board.keyMap).reduce(
        (sum, n) => sum + Number(n),
        0
    );
    return remainingSum * lastNumber;
}

let boards = buildBoards();
let [lastNumber, board] = findWinnerPart1(boards);

logAnswer(FIRST, createAnswerFromWinner(board, lastNumber));

function findWinnerPart2(boards) {
    for (let num of drawnNumbers) {
        let i = 0;
        while (i < boards.length) {
            const board = boards[i];
            board.callNumber(num);
            if (board.hasWinner()) {
                if (boards.length === 1) {
                    return [num, boards[0]];
                } else {
                    boards.splice(i, 1);
                }
            } else {
                i++;
            }
        }
    }
}

// Build again to reset - being lazy with resetting internal details
boards = buildBoards();
[lastNumber, board] = findWinnerPart2(boards);

logAnswer(SECOND, createAnswerFromWinner(board, lastNumber));
