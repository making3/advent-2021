const SAMPLE = false;
function runNaiveSolution() {
    let firstLink;
    let link;
    class Link {
        constructor(pair, prev = null, next = null) {
            this.pair = pair;
            this.prev = prev;
            this.next = next;
        }

        setNext(next) {
            this.next = next;
        }

        setPrev(prev) {
            this.prev = prev;
        }
    }

    const counts = {};
    const pairs = {};
    const insertionRules = {};

    getInputArray(SAMPLE)
        .filter(Boolean)
        .forEach((line, i) => {
            if (i === 0) {
                const chars = line.split('');

                for (let i = 0; i < chars.length; i++) {
                    if (!(chars[i] in counts)) {
                        counts[chars[i]] = 0;
                    }
                    counts[chars[i]]++;

                    if (i + 1 === chars.length) {
                        break;
                    }

                    const pair = chars[i] + chars[i + 1];
                    if (i === 0) {
                        link = new Link(pair);
                        firstLink = link;
                    } else {
                        const newLink = new Link(pair, link);

                        link.setNext(newLink);

                        link = newLink;
                    }

                    if (!(pair in pairs)) {
                        pairs[pair] = new Set();
                    }

                    pairs[pair].add(link);
                }
                return;
            }

            const [pairName, insertionChar] = line.split('->');

            insertionRules[pairName.trim()] = insertionChar.trim();
        });

    const steps = 10;

    for (let i = 0; i < steps; i++) {
        const entries = Object.entries(pairs);

        let queueOfEvents = [];

        entries.forEach(([pair, links]) => {
            for (const link of links) {
                queueOfEvents.push(() => {
                    const prev = link.prev;
                    const next = link.next;

                    const newChar = insertionRules[pair];
                    if (!(newChar in counts)) {
                        counts[newChar] = 0;
                    }
                    counts[newChar]++;

                    const [a, b] = pair.split('');
                    const newLink1 = new Link(a + newChar, prev);
                    if (prev) {
                        prev.setNext(newLink1);
                    } else {
                        firstLink = newLink1;
                    }
                    const newLink2 = new Link(newChar + b, newLink1, next);

                    pairs[link.pair].delete(link);

                    newLink1.setNext(newLink2);

                    if (next) {
                        next.setPrev(newLink2);
                    }

                    if (!(newLink1.pair in pairs)) {
                        pairs[newLink1.pair] = new Set();
                    }
                    if (!(newLink2.pair in pairs)) {
                        pairs[newLink2.pair] = new Set();
                    }
                    pairs[newLink1.pair].add(newLink1);
                    pairs[newLink2.pair].add(newLink2);
                });
            }
        });
        queueOfEvents.forEach((q) => q());
    }

    const least = Math.min(...Object.values(counts));
    const most = Math.max(...Object.values(counts));

    logAnswer(FIRST, most - least);
}

function runPerformantSolution() {
    const initialCounts = {};
    const pairs = [];
    const insertionRules = {};

    getInputArray(SAMPLE)
        .filter(Boolean)
        .forEach((line, i) => {
            if (i === 0) {
                const chars = line.split('');

                for (let i = 0; i < chars.length; i++) {
                    if (!(chars[i] in initialCounts)) {
                        initialCounts[chars[i]] = 0;
                    }
                    initialCounts[chars[i]]++;

                    if (i + 1 === chars.length) {
                        break;
                    }

                    pairs.push(chars[i] + chars[i + 1]);
                }
                return;
            }

            const [pairName, insertionChar] = line.split('->');

            insertionRules[pairName.trim()] = insertionChar.trim();
        });

    function mergeCounts(a, b) {
        const counts = { ...a, ...b };
        const chars = [...Object.keys(a), ...Object.keys(b)];

        for (const char of chars) {
            counts[char] = (a[char] || 0) + (b[char] || 0);
        }

        return counts;
    }

    const cache = {};
    const maxSteps = 40;
    function calculateCounts(pair, step) {
        if (step === maxSteps) {
            return {};
        }

        const cacheKey = `${pair}-${step}`;
        if (!(cacheKey in cache)) {
            const newChar = insertionRules[pair];

            const [a, b] = pair.split('');

            const left = a + newChar;
            const right = newChar + b;

            const newCounts1 = calculateCounts(left, step + 1);
            const newCounts2 = calculateCounts(right, step + 1);
            const counts = mergeCounts(newCounts1, newCounts2);

            if (!(newChar in counts)) {
                counts[newChar] = 0;
            }
            counts[newChar]++;
            cache[cacheKey] = counts;
        }

        return cache[cacheKey];
    }

    let counts = initialCounts;
    for (const pair of pairs) {
        const c = calculateCounts(pair, 0);
        counts = mergeCounts(counts, c);
    }

    const least = Math.min(...Object.values(counts));
    const most = Math.max(...Object.values(counts));

    logAnswer(SECOND, most - least);
}

runNaiveSolution();

runPerformantSolution();
