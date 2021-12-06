const input = getInputArray(false);

const drawnNumbers = input[0].split(',');

class Combination {
    constructor() {
        this.keys = [];
        this.originalList = [];
    }
    add(key) {
        this.keys.push(key);
        this.originalList.push(key);
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
        // const diagonal = new Combination();
        // for (let i = 0; i < 5; i++) {
        //     const key = this.board[i][i];
        //     diagonal.add(key);

        //     const original = this.keyMap[key];
        //     this.keyMap[key] = () => {
        //         original();
        //         diagonal.remove(key);
        //     };
        // }

        // const reverseDiagonal = new Combination();
        // for (let row = 0, col = 4; row < 5; row++, col--) {
        //     const key = this.board[row][col];
        //     reverseDiagonal.add(key);
        //     const original = this.keyMap[key];

        //     this.keyMap[key] = () => {
        //         original();
        //         reverseDiagonal.remove(key);
        //     };
        // }
        // this.combinations.push(diagonal);
        // this.combinations.push(reverseDiagonal);
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

function findWinner() {
    let num;
    let board;
    for (num of drawnNumbers) {
        for (board of boards) {
            board.callNumber(num);
            if (board.hasWinner()) {
                return [num, board];
            }
        }
    }
}
const [num, board] = findWinner();
const remainingSum = Object.keys(board.keyMap).reduce(
    (sum, n) => sum + Number(n),
    0
);

logAnswer(FIRST, remainingSum * num);
