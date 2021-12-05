const fs = require('fs');
const path = require('path');
const day = process.argv[2];

function readInput(shouldUseSample = false) {
    const inputPath = path.resolve(
        __dirname,
        day,
        shouldUseSample ? 'sample' : 'input'
    );
    return fs.readFileSync(inputPath, 'utf-8');
}
exports.readInput = readInput;

exports.readInputArray = (shouldUseSample = false) =>
    readInput(shouldUseSample).split('\r\n');
