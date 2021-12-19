const SAMPLE = false;

class Graph {
    constructor() {
        this.nodes = [];
        this.edges = {};
    }

    addNode(node) {
        this.nodes.push(node);
    }

    addEdge(from, to) {
        if (!(from in this.edges)) {
            this.edges[from] = [];
        }
        this.edges[from].push(to);
    }
}

let graph = new Graph();

const input = getInputArray(SAMPLE).map((line, row) =>
    line
        .trim()
        .split('')
        .map((n, col) => {
            const node = {
                row,
                col,
                val: Number(n),
            };
            graph.addNode(node);
            return Number(n);
        })
);

let colLength = input[0].length;

const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
];

function addEdgesToGraph(rawGraph, colLength) {
    graph.nodes.forEach((node, i) => {
        const { row, col } = node;

        for (const [x, y] of directions) {
            if (rawGraph[row + x]?.[col + y]) {
                const toIndex = (row + x) * colLength + (col + y);
                graph.addEdge(i, toIndex);
            }
        }
    });
}
addEdgesToGraph(input, colLength);

function getMinimumDistance(dist, visited) {
    let min = Number.MAX_VALUE;
    let minIndex = -1;

    for (let i = 0; i < nodeLength; i++) {
        if (!visited[i] && dist[i] <= min) {
            minIndex = i;
            min = dist[i];
        }
    }

    return minIndex;
}

function Dijkstra() {
    let visited = new Array(nodeLength);
    let dist = new Array(nodeLength);

    for (let i = 0; i < nodeLength; i++) {
        visited[i] = false;
        dist[i] = Number.MAX_VALUE;
    }

    dist[0] = 0; // source

    for (let i = 0; i < nodeLength; i++) {
        let shortestNodeIndex = getMinimumDistance(dist, visited);

        visited[shortestNodeIndex] = true;

        const nodeEdgeIndexes = graph.edges[shortestNodeIndex];
        for (const edgeIndex of nodeEdgeIndexes) {
            if (
                !visited[edgeIndex] &&
                dist[shortestNodeIndex] !== Number.MAX_VALUE &&
                dist[shortestNodeIndex] + graph.nodes[edgeIndex].val <
                    dist[edgeIndex]
            ) {
                dist[edgeIndex] =
                    dist[shortestNodeIndex] + graph.nodes[edgeIndex].val;

                if (edgeIndex === nodeLength - 1) {
                    return dist[edgeIndex];
                }
            }
        }
    }
    return dist[nodeLength - 1];
}

let nodeLength = graph.nodes.length;

logAnswer(FIRST, Dijkstra());

const lines = getInputArray(SAMPLE);
graph = new Graph();

function addNodes(row, initialNodes, tile = 0) {
    if (tile === 5) {
        return;
    }

    const newNodes = initialNodes.map((n, col) => {
        const node = {
            row,
            col: col + tile * initialNodes.length,
            val: Number(n),
        };

        graph.addNode(node);

        if (n + 1 > 9) {
            return 1;
        }
        return n + 1;
    });

    if (tile < 4) {
        lines[row] = lines[row].concat(newNodes);
    }
    addNodes(row, newNodes, tile + 1);
    return newNodes;
}

let tile = 0;

function addRows(tile = 0) {
    if (tile === 5) {
        return;
    }
    const len = lines.length;

    for (let row = 0 + colLength * tile; row < len; row++) {
        const initialNodes = Array.isArray(lines[row])
            ? lines[row]
            : lines[row]
                  .trim()
                  .split('')
                  .map((n) => Number(n));

        lines[row] = initialNodes;
        const newNodes = addNodes(row, initialNodes);
        if (tile < 4) {
            lines.push(newNodes);
        }
    }
    addRows(tile + 1);
}

addRows();
addEdgesToGraph(lines, input[0].length * 5);

nodeLength = graph.nodes.length;
logAnswer(SECOND, Dijkstra());
