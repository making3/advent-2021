const SAMPLE = true;

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

const graph = new Graph();

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

const colLength = input[0].length;

const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
];

graph.nodes.forEach((node, i) => {
    const { row, col } = node;

    for (const [x, y] of directions) {
        if (input[row + x]?.[col + y]) {
            const toIndex = (row + x) * colLength + (col + y);
            graph.addEdge(i, toIndex);
        }
    }
});

const nodeLength = graph.nodes.length;

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

logAnswer(FIRST, Dijkstra());
