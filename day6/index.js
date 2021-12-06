const input = getInput(false);

const initialFish = input
    .split(',')
    .filter(Boolean)
    .map((n) => Number(n));

function runNaiveSolution(days) {
    let fish;

    class Lanternfish {
        constructor(daysLeft) {
            this.daysLeft = daysLeft;
        }

        tick() {
            if (this.daysLeft === 0) {
                this.daysLeft = 6;
                fish.push(new Lanternfish(8));
            } else {
                this.daysLeft--;
            }
        }
    }
    fish = initialFish.map((daysLeft) => new Lanternfish(daysLeft));
    for (let i = 0; i < days; i++) {
        const currentFishCount = fish.length;
        for (let k = 0; k < currentFishCount; k++) {
            fish[k].tick();
        }
    }
    return fish;
}

function runPerformantSolution(totalDays) {
    let cache = {};
    function calculateFishProduced(
        daysLeft,
        remainingDays,
        isInitialDay = false
    ) {
        if (cache[remainingDays] && !isInitialDay) {
            return cache[remainingDays];
        }
        if (remainingDays <= 0) {
            return 1;
        }
        // 80 - (3+1) = 76
        // 76 - 8 = 68
        const fullDays = remainingDays - (daysLeft + 1);

        // 76 / 7 = 10 more fish JUST from this fish.
        // 68 / 7 = 9 more fish JUST from this fish.
        const totalFishProduced = Math.floor(fullDays / 7) + 1;

        // So 10 fish from full days + 1 from the 4 days up front

        let totalChildrenFishProduced = 0;
        for (let i = 0; i < totalFishProduced; i++) {
            const startDayOffset = i * 7;
            totalChildrenFishProduced += calculateFishProduced(
                8,
                remainingDays - (daysLeft + 1) - startDayOffset
            );
        }

        if (!isInitialDay) {
            cache[remainingDays] = 1 + totalChildrenFishProduced;
        }

        return 1 + totalChildrenFishProduced;
    }

    return initialFish.reduce(
        (totalFish, daysLeft) =>
            totalFish + calculateFishProduced(daysLeft, totalDays, true),
        0
    );
}

logAnswer(FIRST, runNaiveSolution(80).length);
// logAnswer(FIRST, runPerformantSolution(256));

logAnswer(SECOND, runPerformantSolution(256));
