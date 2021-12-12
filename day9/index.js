const input = getInputArray(false);
const points = input.map((v) => v.split(''));

let output = 0;

function getBasinSize(row, col, previousPoint) {
    const point = Number(points[row]?.[col] || 9);
    if (point === 9 || point <= previousPoint) {
        return 0;
    }
    points[row][col] = 9; // Set current point to 9 so we don't re-calc

    return (
        1 +
        getBasinSize(row + 1, col, point) +
        getBasinSize(row - 1, col, point) +
        getBasinSize(row, col + 1, point) +
        getBasinSize(row, col - 1, point)
    );
}

let basins = [];
for (let i = 0; i < points.length; i++) {
    for (let k = 0; k < points[i].length; k++) {
        const point = points[i][k];

        if (
            (points[i + 1]?.[k] || 10) > point &&
            (points[i - 1]?.[k] || 10) > point &&
            (points[i][k + 1] || 10) > point &&
            (points[i][k - 1] || 10) > point
        ) {
            output = output + 1 + Number(point);

            const basinSize = getBasinSize(i, k, -1);
            basins.push(basinSize);
        }
    }
}

logAnswer(FIRST, output);

basins.sort((a, b) => a - b);

const [a, b, c] = basins.slice(-3);
logAnswer(SECOND, a * b * c);
