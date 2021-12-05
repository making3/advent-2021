const readInput = require('./readInput');

global.FIRST = 'First';
global.SECOND = 'Second';
global.getInput = readInput.readInput;
global.getInputArray = readInput.readInputArray;
global.logAnswer = (puzzle, answer) => {
    console.log(`${puzzle}: ${answer}`)
}

const day = process.argv[2];
if (!day) {
    throw new Error('Please specify a day');
}

require(`./${day}`);