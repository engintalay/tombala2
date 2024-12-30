const fs = require('fs');

function generateAllCards() {
    const allCards = {};
    const generatedCards = new Set();
    let cardId = 1;

    while (cardId <= 24) { // Generate 24 unique cards as an example
        const cardNumbers = Array(27).fill(null);
        const columns = Array.from({ length: 9 }, (_, i) => {
            const start = i * 10 + 1;
            const end = start + 9;
            return Array.from({ length: 10 }, (_, j) => start + j);
        });

        const columnCounts = Array(9).fill(0);

        [0, 9, 18].forEach(start => {
            const rowNumbers = [];
            while (rowNumbers.length < 5) {
                const colIndex = Math.floor(Math.random() * 9);
                const col = columns[colIndex];
                if (col.length > 0 && columnCounts[colIndex] < 2) {
                    const num = col.splice(Math.floor(Math.random() * col.length), 1)[0];
                    rowNumbers.push({ num, colIndex });
                    columnCounts[colIndex]++;
                }
            }
            rowNumbers.sort((a, b) => a.colIndex - b.colIndex).forEach(({ num, colIndex }) => {
                cardNumbers[start + colIndex] = num;
            });
        });

        // Ensure each column has at least 1 number
        for (let i = 0; i < 9; i++) {
            if (columnCounts[i] === 0) {
                const col = columns[i];
                const num = col.splice(Math.floor(Math.random() * col.length), 1)[0];
                const emptyIndex = [0, 9, 18].find(start => cardNumbers[start + i] === null);
                cardNumbers[emptyIndex + i] = num;
                columnCounts[i]++;
            }
        }

        const cardString = JSON.stringify(cardNumbers);
        if (!generatedCards.has(cardString)) {
            generatedCards.add(cardString);
            allCards[cardId++] = cardNumbers;
        }
    }

    fs.writeFileSync('cards.json', JSON.stringify(allCards, null, 2));
}

generateAllCards();
