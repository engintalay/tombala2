const fs = require('fs');

/**
 * Generates tombala cards with the following rules:
 * - Each card is a 3x9 grid (27 cells total)
 * - Each row has exactly 5 numbers and 4 blanks
 * - Each card has exactly 15 numbers total
 * - Column 0: numbers 1-9, Column 1: 10-19, ..., Column 8: 80-90
 * - Each column has 1-3 numbers distributed across the 3 rows
 */
function generateAllCards() {
    const allCards = {};
    const generatedCards = new Set();
    let cardId = 1;
    const maxAttempts = 1000; // Prevent infinite loops

    while (cardId <= 24) {
        let attempts = 0;
        let cardGenerated = false;

        while (!cardGenerated && attempts < maxAttempts) {
            attempts++;
            const cardNumbers = Array(27).fill(null);
            
            // Initialize columns with available numbers
            const columns = Array.from({ length: 9 }, (_, i) => {
                const start = i === 0 ? 1 : i * 10;
                const end = i === 8 ? 90 : (i + 1) * 10 - 1;
                const nums = [];
                for (let j = start; j <= end; j++) {
                    nums.push(j);
                }
                return nums;
            });

            // Track how many numbers each column will have
            const columnCounts = Array(9).fill(0);

            try {
                // For each row, place exactly 5 numbers
                for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
                    const rowStart = rowIndex * 9;
                    const availableColumns = [];
                    
                    // Find columns that can still accept numbers
                    for (let col = 0; col < 9; col++) {
                        if (columnCounts[col] < 3 && columns[col].length > 0) {
                            availableColumns.push(col);
                        }
                    }

                    if (availableColumns.length < 5) {
                        throw new Error('Not enough available columns');
                    }

                    // Randomly select 5 columns for this row
                    const selectedColumns = [];
                    const shuffled = [...availableColumns].sort(() => Math.random() - 0.5);
                    for (let i = 0; i < 5 && i < shuffled.length; i++) {
                        selectedColumns.push(shuffled[i]);
                    }
                    selectedColumns.sort((a, b) => a - b);

                    // Place numbers in selected columns
                    selectedColumns.forEach(colIndex => {
                        const col = columns[colIndex];
                        if (col.length > 0) {
                            const numIndex = Math.floor(Math.random() * col.length);
                            const num = col.splice(numIndex, 1)[0];
                            cardNumbers[rowStart + colIndex] = num;
                            columnCounts[colIndex]++;
                        }
                    });
                }

                // Validate: each row should have exactly 5 numbers
                let valid = true;
                for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
                    const rowStart = rowIndex * 9;
                    const rowNums = cardNumbers.slice(rowStart, rowStart + 9).filter(n => n !== null);
                    if (rowNums.length !== 5) {
                        valid = false;
                        break;
                    }
                }

                // Ensure each column has at least 1 number
                for (let col = 0; col < 9; col++) {
                    if (columnCounts[col] === 0) {
                        valid = false;
                        break;
                    }
                }

                if (valid) {
                    const cardString = JSON.stringify(cardNumbers);
                    if (!generatedCards.has(cardString)) {
                        generatedCards.add(cardString);
                        allCards[cardId++] = cardNumbers;
                        cardGenerated = true;
                    }
                }
            } catch (error) {
                // Try again
                continue;
            }
        }

        if (!cardGenerated) {
            console.log(`Warning: Could not generate unique card ${cardId} after ${maxAttempts} attempts`);
            cardId++; // Skip this card
        }
    }

    fs.writeFileSync('cards.json', JSON.stringify(allCards, null, 2));
    console.log(`Successfully generated ${Object.keys(allCards).length} unique tombala cards`);
}

generateAllCards();
