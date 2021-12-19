const SAMPLE = true;

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

    return [parseInt(finalResults, 2), packet.slice(index), index + 1];
}

function processTotalLengthBits(packetValue) {
    const maxSubpacketBits = parseInt(packetValue.slice(0, 15), 2);
    let p = packetValue.slice(15);
    let r = [];
    let totalSubpacketLength = 0;
    while (p.includes('1') && totalSubpacketLength <= maxSubpacketBits) {
        const [result, newP, len] = processPacketValue(p);
        totalSubpacketLength += len;
        r.push(result);
        p = newP;
    }
    return [r, p, totalSubpacketLength];
}

function processMaxSubpackets(packetValue) {
    const numSubPackets = parseInt(packetValue.slice(0, 11), 2);

    let r = [];
    let p = packetValue.slice(11);
    let totalProcessLen = 0;
    for (let i = 0; i < numSubPackets; i++) {
        const [result, newP, processedLen] = processPacketValue(p);
        p = newP;
        r.push(result);
        totalProcessLen += processedLen;
        if (!newP.includes('1')) {
            // Break since this would technically be the end
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
    throw new Error(packetValue);
}

function decode(typeId, results) {
    switch (typeId) {
        case 0:
            return results.reduce((total, n) => total + n, 0);
        case 1:
            return results.reduce((total, n) => {
                return total * n;
            }, 1);
        case 2:
            return Math.min(...results);
        case 3:
            return Math.max(...results);
        case 5:
            if (results.length !== 2) {
                console.log('results', results);
                throw new Error('greater -> not 2', results);
            }
            return results[0] > results[1] ? 1 : 0;
        case 6:
            if (results.length !== 2) {
                console.log('results', results);
                throw new Error('less -> not 2', results);
            }
            return results[0] < results[1] ? 1 : 0;
        case 7:
            if (results.length !== 2) {
                console.log('results', results);
                throw new Error('equal -> not 2', results);
            }
            return results[0] === results[1] ? 1 : 0;
    }
}

let versionValue = 0;
function makeDecision(packetValue, typeId) {
    if (typeId === 4) {
        const v = getLiteralValue(packetValue);
        return v;
    }
    const lengthTypeId = parseInt(packetValue[0], 2);
    const [results, remaining, len] = processLengthTypeId(
        packetValue.slice(1),
        lengthTypeId
    );

    return [decode(typeId, results), remaining, len];
}

function processPacketValue(packet) {
    const version = parseInt(packet.slice(0, 3), 2);
    versionValue += version;
    const typeId = parseInt(packet.slice(3, 6), 2);

    const packetValue = packet.slice(6);

    const [a, b, len] = makeDecision(packetValue, typeId);
    return [a, b, len + 6];
}

function processPacket(hexPacket) {
    const packet = hexPacket
        .split('')
        .reduce((result, letter) => (result += hex2bin(letter)), '');
    let p = packet;
    let total = 0;
    while (p && p.includes('1')) {
        const [result, newP, len] = processPacketValue(p);
        p = newP;
        total += result;
    }
    return total;
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
    console.log(processPacket('C200B40A82')); // 3
    console.log();

    console.log(processPacket('04005AC33890')); // 54
    console.log();

    console.log(processPacket('880086C3E88112')); // 7
    console.log();

    console.log(processPacket('CE00C43D881120')); // 9
    console.log();

    console.log(processPacket('D8005AC2A8F0')); // 1
    console.log();

    console.log(processPacket('F600BC2D8F')); // 0
    console.log();

    console.log(processPacket('9C005AC2F8F0')); // 0
    console.log();

    console.log(processPacket('9C0141080250320F1802104A08')); // 1
    console.log();

    console.log(processPacket('3232D42BF9400')); // 5000000000 - 5,000,000,000
    console.log();

    console.log('supposed to be ');
    console.log(258888628940);
    console.log(
        processPacket(
            '005410C99A9802DA00B43887138F72F4F652CC0159FE05E802B3A572DBBE5AA5F56F6B6A4600FCCAACEA9CE0E1002013A55389B064C0269813952F983595234002DA394615002A47E06C0125CF7B74FE00E6FC470D4C0129260B005E73FCDFC3A5B77BF2FB4E0009C27ECEF293824CC76902B3004F8017A999EC22770412BE2A1004E3DCDFA146D00020670B9C0129A8D79BB7E88926BA401BAD004892BBDEF20D253BE70C53CA5399AB648EBBAAF0BD402B95349201938264C7699C5A0592AF8001E3C09972A949AD4AE2CB3230AC37FC919801F2A7A402978002150E60BC6700043A23C618E20008644782F10C80262F005679A679BE733C3F3005BC01496F60865B39AF8A2478A04017DCBEAB32FA0055E6286D31430300AE7C7E79AE55324CA679F9002239992BC689A8D6FE084012AE73BDFE39EBF186738B33BD9FA91B14CB7785EC01CE4DCE1AE2DCFD7D23098A98411973E30052C012978F7DD089689ACD4A7A80CCEFEB9EC56880485951DB00400010D8A30CA1500021B0D625450700227A30A774B2600ACD56F981E580272AA3319ACC04C015C00AFA4616C63D4DFF289319A9DC401008650927B2232F70784AE0124D65A25FD3A34CC61A6449246986E300425AF873A00CD4401C8A90D60E8803D08A0DC673005E692B000DA85B268E4021D4E41C6802E49AB57D1ED1166AD5F47B4433005F401496867C2B3E7112C0050C20043A17C208B240087425871180C01985D07A22980273247801988803B08A2DC191006A2141289640133E80212C3D2C3F377B09900A53E00900021109623425100723DC6884D3B7CFE1D2C6036D180D053002880BC530025C00F700308096110021C00C001E44C00F001955805A62013D0400B400ED500307400949C00F92972B6BC3F47A96D21C5730047003770004323E44F8B80008441C8F51366F38F240'
        )
    ); // 258888628940 - 258,888,628,940 ---- 44,397,907,474
} else {
    const a = processPacket(getInput());
    logAnswer(FIRST, versionValue);

    logAnswer(SECOND, a);
}
