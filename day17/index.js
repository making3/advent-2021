const [, targets] = getInput(false).split(':');
const [x, y] = targets
    .trim()
    .split(',')
    .map((t) => {
        const [, v] = t.split('=');

        const [from, to] = v.split('..');

        const values = [];
        for (let i = Number(from); i <= Number(to); i++) {
            values.push(i);
        }
        return values;
    });
const target = { x, y };

// target area: x=20..30, y=-10..-5

// probe's x,y position starts at 0,0

// x, y
// x = forward
// y = up/down

function getMaxY(initialTrajectory, target) {
    let maxY = -5000;
    let position = { x: 0, y: 0 };
    let trajectory = initialTrajectory;

    function step() {
        position.x += trajectory.x;
        position.y += trajectory.y;

        if (trajectory.x > 0) {
            trajectory.x--;
        } else if (trajectory.x < 0) {
            trajectory.x++;
        }

        trajectory.y--;

        if (position.y > maxY) {
            maxY = position.y;
        }
    }

    while (position.y > target.y[0]) {
        step();
        if (target.x.includes(position.x) && target.y.includes(position.y)) {
            return maxY;
        }
    }
}

function findMaxY(target) {
    let x = 0;
    let maxYfound = -5000;
    let total = 0;

    while (x <= target.x[target.x.length - 1] * 2) {
        let y = target.y[0] - 10;

        while (y <= 800) {
            const result = getMaxY({ x, y }, target);

            if (result > maxYfound) {
                maxYfound = result;
            }
            if (result !== undefined) {
                total++;
            }
            y++;
        }

        x++;
    }

    return [maxYfound, total];
}

// console.log(getMaxY({ x: 7, y: 2 }, target));
// console.log(getMaxY({ x: 6, y: 3 }, target));
// console.log(getMaxY({ x: 9, y: 0 }, target));
// console.log(getMaxY({ x: 17, y: -4 }, target));
// console.log(getMaxY({ x: 6, y: 9 }, target));

const [maxY, total] = findMaxY(target);
logAnswer(FIRST, maxY);
logAnswer(SECOND, total);
