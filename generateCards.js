const fs = require('fs');

function generateAllCards() {
    const allCards = {};
    let cardId = 1;

    for (let i = 0; i < 1000; i++) { // Generate 1000 cards as an example
        const cardNumbers = Array(27).fill(null);
        const columns = Array.from({ length: 9 }, (_, i) => {
            const start = i * 10 + 1;
            const end = start + 9;
            return Array.from({ length: 10 }, (_, j) => start + j);
        });

        [0, 9, 18].forEach(start => {
            const rowNumbers = [];
            while (rowNumbers.length < 5) {
                const colIndex = Math.floor(Math.random() * 9);
                const col = columns[colIndex];
                if (col.length > 0) {
                    const num = col.splice(Math.floor(Math.random() * col.length), 1)[0];
                    rowNumbers.push({ num, colIndex });
                }
            }
            rowNumbers.sort((a, b) => a.colIndex - b.colIndex).forEach(({ num, colIndex }) => {
                cardNumbers[start + colIndex] = num;
            });
        });

        allCards[cardId++] = cardNumbers;
    }

    fs.writeFileSync('cards.json', JSON.stringify(allCards, null, 2));
}

generateAllCards();
