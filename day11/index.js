let flashes = 0;

class Octopus {
    constructor(row, col, number) {
        this.row = row;
        this.col = col;
        this.number = Number(number);
        this.hasFlashed = false;
    }
    tick() {
        if (!this.hasFlashed) {
            if (this.number + 1 > 9) {
                this.flash();
            } else {
                this.number = this.number + 1;
            }
        }
    }
    flash() {
        flashes++;
        this.number = 0;
        this.hasFlashed = true;
        this.tickAdjacent();
    }
    tickAdjacent() {
        const row = this.row;
        const col = this.col;

        // Down
        input[row + 1]?.[col]?.tick();

        // Up
        input[row - 1]?.[col]?.tick();

        // Right
        input[row][col + 1]?.tick();

        // Left
        input[row]?.[col - 1]?.tick();

        // Bottom Left
        input[row + 1]?.[col - 1]?.tick();

        // Bottom Right
        input[row + 1]?.[col + 1]?.tick();

        // Top Left
        input[row - 1]?.[col - 1]?.tick();

        // Top Right
        input[row - 1]?.[col + 1]?.tick();
    }
    reset() {
        this.hasFlashed = false;
    }
}

let input = getInputArray(true).map((line, row) =>
    line.split('').map((n, col) => new Octopus(row, col, n))
);

const tickCount = 100;

for (let i = 0; i < tickCount; i++) {
    for (const row of input) {
        for (const octopus of row) {
            octopus.tick();
        }
    }

    for (const row of input) {
        for (const octopus of row) {
            octopus.reset();
        }
    }
}

logAnswer(FIRST, flashes);

input = getInputArray(false).map((line, row) =>
    line.split('').map((n, col) => new Octopus(row, col, n))
);
let i = 1;
while (true) {
    for (const row of input) {
        for (const octopus of row) {
            octopus.tick();
        }
    }

    let nSync = true;
    for (const row of input) {
        for (const octopus of row) {
            if (!octopus.hasFlashed) {
                nSync = false;
            }
            octopus.reset();
        }
    }
    if (nSync) {
        break;
    }
    i++;
}

logAnswer(SECOND, i);
