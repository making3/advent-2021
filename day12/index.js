const input = getInputArray(false);

class Cave {
    constructor(name) {
        this.name = name;
        this.connections = {};
    }
    addConnection(connectionName, cave) {
        this.connections[connectionName] = cave;
    }
    canVisit() {
        return this.name !== 'start';
    }
    canRevisit() {
        return (
            this.name !== this.name.toLowerCase() &&
            this.name !== 'start' &&
            this.name !== 'end'
        );
    }
}

const caves = {};

for (const connection of input) {
    const [first, second] = connection.split('-');

    if (!(first in caves)) {
        caves[first] = new Cave(first);
    }
    if (!(second in caves)) {
        caves[second] = new Cave(second);
    }

    caves[first].addConnection(second, caves[second]);
    caves[second].addConnection(first, caves[first]);
}

let all = [];
function findPathsPart1(currentPath, cave, smallCavesVisited) {
    if (cave.name === 'end') {
        all.push(currentPath);
        return;
    }
    Object.values(cave.connections).forEach((connectedCave) => {
        if (
            connectedCave.canVisit() &&
            !smallCavesVisited.includes(connectedCave.name)
        ) {
            const smallCaves = [...smallCavesVisited];
            if (!cave.canRevisit()) {
                smallCaves.push(cave.name);
            }
            findPathsPart1(
                [...currentPath, connectedCave.name],
                connectedCave,
                smallCaves
            );
        }
    });
}

findPathsPart1(['start'], caves.start, []);

logAnswer(FIRST, all.length);

all = [];
function findPathsPart2(currentPath, cave, smallCavesVisited) {
    if (cave.name === 'end') {
        all.push(currentPath);
        return;
    }
    Object.values(cave.connections).forEach((connectedCave) => {
        if (!connectedCave.canVisit()) {
            return;
        }
        const smallCaves = { ...smallCavesVisited };

        if (!cave.canRevisit()) {
            if (!(cave.name in smallCaves)) {
                smallCaves[cave.name] = 0;
                // If anything has been visited twice already
            } else if (Object.values(smallCaves).some((n) => n === 2)) {
                return;
            }
            smallCaves[cave.name]++;
        }
        findPathsPart2(
            [...currentPath, connectedCave.name],
            connectedCave,
            smallCaves
        );
    });
}

findPathsPart2(['start'], caves.start, {});
logAnswer(SECOND, all.length);
