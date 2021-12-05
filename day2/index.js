const input = getInputArray(false);

let depth = 0;
let horizontalPosition = 0;

for (const direction of input) {
    const [instruction, countStr] = direction.split(' ');
    const count = Number(countStr);

    if (instruction === 'forward') {
        horizontalPosition = horizontalPosition + count;
    }

    if (instruction === 'up') {
        depth = depth - count;
    }

    if (instruction === 'down') {
        depth = depth + count;
    }
}

logAnswer(FIRST, depth * horizontalPosition);

depth = 0;
horizontalPosition = 0;
let aim = 0;

for (const direction of input) {
    const [instruction, countStr] = direction.split(' ');
    const count = Number(countStr);

    if (instruction === 'forward') {
        horizontalPosition = horizontalPosition + count;
        depth = depth + aim * count;
    }

    if (instruction === 'up') {
        aim = aim - count;
    }

    if (instruction === 'down') {
        aim = aim + count;
    }
}

logAnswer(SECOND, depth * horizontalPosition);
