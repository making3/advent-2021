const SAMPLE = false;

function hex2bin(data) {
    return data
        .split('')
        .map((i) => parseInt(i, 16).toString(2).padStart(4, '0'))
        .join('');
}

function getLiteralValue(packet) {
    let index = 0;
    let keepSearching = true;

    let finalResults = '';
    while (keepSearching) {
        finalResults += packet.slice(index + 1, index + 5);

        keepSearching = packet[index] == 1;
        index = index + 5;
    }

    return [parseInt(finalResults, 2), packet.slice(index), index];
}

function processTotalLengthBits(packetValue) {
    const maxSubpacketBits = parseInt(packetValue.slice(0, 15), 2);
    let p = packetValue.slice(15);
    let r = 0;
    let totalSubpacketLength = 0;
    while (p.includes('1') && totalSubpacketLength < maxSubpacketBits) {
        const [result, newP, len] = processPacketValue(p);
        totalSubpacketLength += len + 6; // add 6 as that is the version + type
        r += result;
        p = newP;
    }
    return [r, p, totalSubpacketLength];
}

function processMaxSubpackets(packetValue) {
    const numSubPackets = parseInt(packetValue.slice(0, 11), 2);

    let r = 0;
    let p = packetValue.slice(11);
    let totalProcessLen = 0;
    for (let i = 0; i < numSubPackets; i++) {
        const [result, newP, processedLen] = processPacketValue(p);
        p = newP;
        r += result;
        totalProcessLen += processedLen;
        if (!newP.includes('1')) {
            //
            break;
        }
    }
    return [r, p, totalProcessLen];
}

function processLengthTypeId(packetValue, typeId) {
    if (typeId === 0) {
        return processTotalLengthBits(packetValue);
    } else if (typeId === 1) {
        return processMaxSubpackets(packetValue);
    }
    throw new Error('?!?!?!?');
}

let versionValue = 0;
function makeDecision(packetValue, typeId) {
    if (typeId === 4) {
        return getLiteralValue(packetValue);
    } else {
        const lengthTypeId = parseInt(packetValue[0], 2);
        return processLengthTypeId(packetValue.slice(1), lengthTypeId);
    }
}

function processPacketValue(packet) {
    const version = parseInt(packet.slice(0, 3), 2);
    versionValue += version;
    const typeId = parseInt(packet.slice(3, 6), 2);

    const packetValue = packet.slice(6);

    return makeDecision(packetValue, typeId);
}

function processPacket(hexPacket) {
    const packet = hexPacket
        .split('')
        .reduce((result, letter) => (result += hex2bin(letter)), '');
    return processPacketValue(packet);
}

if (SAMPLE) {
    console.log('====PART 1 EXAMPLES===');
    console.log(processPacket('D2FE28')); // 6
    console.log('version', versionValue);
    console.log();
    versionValue = 0;

    console.log(processPacket('38006F45291200')); // 1 + (6 + 2) = 9
    console.log('version', versionValue);
    console.log();
    versionValue = 0;

    console.log(processPacket('EE00D40C823060')); // 7 + (2 + 4 + 1) = 14
    console.log('version', versionValue);
    console.log();
    versionValue = 0;

    console.log(processPacket('8A004A801A8002F478')); // 16
    console.log('version', versionValue);
    console.log();
    versionValue = 0;

    console.log(processPacket('620080001611562C8802118E34')); // 12
    console.log('version', versionValue);
    console.log();
    versionValue = 0;

    console.log(processPacket('C0015000016115A2E0802F182340')); // 23
    console.log('version', versionValue);
    console.log();
    versionValue = 0;

    console.log(processPacket('A0016C880162017C3686B18A3D4780')); // 23
    console.log('version', versionValue);
    console.log();
    versionValue = 0;

    console.log('====PART 2 EXAMPLES===');
} else {
    processPacket(getInput());
    logAnswer(FIRST, versionValue);
}
