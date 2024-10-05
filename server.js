const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/calculate', (req, res) => {
    const dob = req.body.dob;
    if (!dob || dob.length !== 8) {
        return res.status(400).json({ error: 'Invalid DOB format. Use DDMMYYYY.' });
    }

    const loshu = Array(10).fill(0);
    for (let i = 0; i < 8; i++) {
        loshu[7 - i] = parseInt(dob[i], 10);
    }

    const matrix = Array.from({ length: 3 }, () => Array(3).fill(0));
    const counts = Array(10).fill(0);

    for (let i = 0; i < 10; i++) {
        counts[loshu[i]]++;
    }

    const positions = [
        [0, 0], [2, 1], [0, 2], [1, 0], [1, 1],
        [2, 2], [1, 2], [2, 0], [0, 1], [0, 0]
    ];

    for (let digit = 1; digit <= 9; digit++) {
        const count = counts[digit];
        let value = digit;
        for (let i = 1; i < count; i++) {
            value = value * 10 + digit;
        }
        if (digit === 5) value = (count > 0) ? 5 + 10 * (count - 1) : 0;
        matrix[positions[digit][0]][positions[digit][1]] = value;
    }

    const personalityNumber = calculateSingleDigit(loshu[0] + loshu[1]);
    const conductorNumber = calculateSingleDigit(loshu.reduce((sum, num) => sum + num, 0));

    const characteristics = getCharacteristics(matrix);

    res.json({
        grid: matrix,
        characteristics: `Personality Number: ${personalityNumber}, Conductor Number: ${conductorNumber}. ${characteristics}`
    });
});

function calculateSingleDigit(sum) {
    while (sum > 9) {
        sum = (sum % 10) + Math.floor(sum / 10);
    }
    return sum;
}

function getCharacteristics(matrix) {
    let characteristics = '';
    const characteristicsMap = {
        4: "These people keep their hands busy... (Details omitted for brevity)",
        44: "These people want accuracy and perfection... (Details omitted for brevity)",
        444: "These people do physical work daily... (Details omitted for brevity)",
        4444: "These people do not fit in society... (Details omitted for brevity)",
        9: "9 is the number of humanity... (Details omitted for brevity)",
        99: "They are intelligent in everything... (Details omitted for brevity)",
        999: "They are ideal people... (Details omitted for brevity)",
        9999: "They are extremely intelligent but oversmart... (Details omitted for brevity)",
        99999: "Gets angry more than necessary... (Details omitted for brevity)",
        2: "These people are generally sensitive... (Details omitted for brevity)",
        22: "These people are very sensitive and intelligent... (Details omitted for brevity)",
        222: "These people are by birth intelligent and ultra-sensitive... (Details omitted for brevity)",
        2222: "These people show off their intuition power... (Details omitted for brevity)",
        22222: "These people face difficulty in spending their lives... (Details omitted for brevity)",
        3: "These people are hungry for knowledge... (Details omitted for brevity)",
        33: "These people are alert from their mind... (Details omitted for brevity)",
        333: "These people live in imagination... (Details omitted for brevity)",
        3333: "These people fly in their imagination power... (Details omitted for brevity)",
        33333: "These people fly in their imagination power... (Details omitted for brevity)",
        5: "These people are emotionally balanced... (Details omitted for brevity)",
        55: "These people do not lack josh... (Details omitted for brevity)",
        555: "These people sometimes overreact... (Details omitted for brevity)",
        5555: "These people have chances of accident... (Details omitted for brevity)",
        55555: "These people have chances of accident... (Details omitted for brevity)",
        7: "These people get cheated in love... (Details omitted for brevity)",
        77: "These people will realize after losing everything... (Details omitted for brevity)",
        777: "These people can't adjust in their life... (Details omitted for brevity)",
        7777: "These people do not find happiness from their children... (Details omitted for brevity)",
        8: "These people are fair loving and do work according to rules... (Details omitted for brevity)",
        88: "These people get successful with slow speed... (Details omitted for brevity)",
        888: "These people will achieve success slowly... (Details omitted for brevity)",
        8888: "These people lack stability in their life... (Details omitted for brevity)",
        1: "These people cannot express their emotions... (Details omitted for brevity)",
        11: "These people easily put themselves forward... (Details omitted for brevity)",
        111: "These people speak more or less than required... (Details omitted for brevity)",
        1111: "These people feel difficulty in explaining themselves... (Details omitted for brevity)",
        11111: "These people cannot explain themselves well... (Details omitted for brevity)",
        6: "These people love their family members... (Details omitted for brevity)",
        66: "These people have more pressure regarding family... (Details omitted for brevity)",
        666: "These people walk according to their children... (Details omitted for brevity)",
        6666: "These people cannot put their energy into their work... (Details omitted for brevity)"
    };

    matrix.forEach(row => {
        row.forEach(value => {
            if (characteristicsMap[value]) {
                characteristics += `\n${value}: ${characteristicsMap[value]}\n`;
            } else {
                characteristics += `\nUnknown (${value}): Details not available.\n`;
            }
        });
    });

    return characteristics;
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
