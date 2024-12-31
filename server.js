const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const open = require('open'); // Ensure this line is present

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let drawnNumbers = [];
let cinkoAchieved = false;
let ciftCinkoAchieved = false;
let gameStarted = false;
let gameStarter = null;
const clientColors = {}; // Store client colors
const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF5']; // Example colors

app.use(express.static('public'));

wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress; // Get the client's IP address
    const clientId = ip + Date.now(); // Generate a unique client ID
    const clientColor = colors.pop() || '#000000'; // Assign a color or default to black
    clientColors[clientId] = clientColor;

    console.log(`New client connected: ${ip}`);
    ws.send(JSON.stringify({ type: 'init', drawnNumbers, cinkoAchieved, ciftCinkoAchieved, gameStarted, clientColor }));

    ws.on('message', (message) => {
        console.log(`Received message from ${ip}:`, message); // Log the IP address
        const data = JSON.parse(message);
        if (data.type === 'drawNumber' && gameStarted && ws === gameStarter) {
            drawNumber(ws);
        } else if (data.type === 'startGame') {
            gameStarted = true;
            gameStarter = ws;
            resetOtherClientsCards();
            saveSelectedCards(data.selectedCards);
            broadcast({ type: 'startGame' });
        } else if (data.type === 'resetGame' && ws === gameStarter) {
            resetGame();
            broadcast({ type: 'resetGame' });
        } else if (data.type === 'saveCard') {
            saveCard(data.cardId, data.cardNumbers, data.ownerName);
        } else if (data.type === 'removeCard') {
            removeCard(data.cardId);
            broadcast({ type: 'deselectCard', cardId: data.cardId });
        } else if (data.type === 'selectCard') {
            saveCard(data.cardId, data.cardNumbers, data.ownerName);
            broadcast({ type: 'selectCard', cardId: data.cardId, cardNumbers: data.cardNumbers, ownerName: data.ownerName, clientColor });
        } else if (data.type === 'deselectCard') {
            removeCard(data.cardId);
            broadcast({ type: 'deselectCard', cardId: data.cardId });
        } else if (data.type === 'stopGame') {
            gameStarted = false;
            broadcast({ type: 'stopGame' });
        }
    });

    ws.on('close', () => {
        console.log(`Client disconnected: ${ip}`);
        colors.push(clientColors[clientId]); // Recycle the color
        delete clientColors[clientId];
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error from ${ip}:`, error);
    });
});

app.get('/generateCard', (req, res) => {
    const card = generateCard();
    res.json(card);
});

app.get('/cards.json', (req, res) => {
    fs.readFile('cards.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading cards.json');
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.get('/savedCards', (req, res) => {
    fs.readFile('otherClientsCards.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading otherClientsCards.json');
            return;
        }
        res.json(JSON.parse(data));
    });
});

function generateCard() {
    const card = [];
    while (card.length < 15) {
        const number = Math.floor(Math.random() * 90) + 1;
        if (!card.includes(number)) {
            card.push(number);
        }
    }
    return card;
}

function drawNumber(ws) {
    if (drawnNumbers.length >= 90) {
        ws.send(JSON.stringify({ type: 'alert', message: 'Tüm taşlar çekildi!' }));
        return;
    }
    let number;
    do {
        number = Math.floor(Math.random() * 90) + 1;
    } while (drawnNumbers.includes(number));
    drawnNumbers.push(number);
    broadcast({ type: 'drawNumber', number, drawnNumbers });
    checkForCinkoOrTombala();
}

function checkForCinkoOrTombala() {
    const cardsData = JSON.parse(fs.readFileSync('otherClientsCards.json'));
    Object.entries(cardsData).forEach(([cardId, cardData]) => {
        const cardNumbers = cardData.cardNumbers;
        const rows = [0, 9, 18];
        let cinkoCount = 0;
        rows.forEach(start => {
            const rowNumbers = cardNumbers.slice(start, start + 9);
            const markedCount = rowNumbers.filter(num => drawnNumbers.includes(num)).length;
            if (markedCount === 5) {
                cinkoCount++;
            }
        });
        if (cinkoCount === 1 && !cinkoAchieved) {
            broadcast({ type: 'cinko', cardId });
            broadcast({ type: 'alert', message: 'Çinko!' });
            cinkoAchieved = true;
        } else if (cinkoCount === 2 && !ciftCinkoAchieved) {
            broadcast({ type: 'ciftCinko', cardId });
            broadcast({ type: 'alert', message: 'Çift Çinko!' });
            ciftCinkoAchieved = true;
        } else if (cinkoCount === 3) {
            broadcast({ type: 'tombala', cardId });
            broadcast({ type: 'alert', message: 'Tombala!' });
            gameStarted = false;
        }
    });
}

function resetGame() {
    drawnNumbers = [];
    cinkoAchieved = false;
    ciftCinkoAchieved = false;
    gameStarted = false;
    gameStarter = null;
    resetOtherClientsCards(); // Add this line to reset the cards
}

function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

function saveCard(cardId, cardNumbers, ownerName) {
    const filePath = 'otherClientsCards.json';
    let cardsData = {};
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        if (fileContent) {
            cardsData = JSON.parse(fileContent);
        }
    }
    cardsData[cardId] = { cardNumbers, ownerName };
    fs.writeFileSync(filePath, JSON.stringify(cardsData, null, 2));
}

function removeCard(cardId) {
    const filePath = 'otherClientsCards.json';
    if (fs.existsSync(filePath)) {
        const cardsData = JSON.parse(fs.readFileSync(filePath));
        delete cardsData[cardId];
        fs.writeFileSync(filePath, JSON.stringify(cardsData, null, 2));
    }
}

function saveSelectedCards(selectedCards) {
    const filePath = 'otherClientsCards.json';
    let cardsData = {};
    selectedCards.forEach(card => {
        cardsData[card.cardId] = { cardNumbers: card.cardNumbers, ownerName: card.ownerName };
    });
    fs.writeFileSync(filePath, JSON.stringify(cardsData, null, 2));
}

function resetOtherClientsCards() {
    const filePath = 'otherClientsCards.json';
    fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
}

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
    open('http://localhost:3000'); // Ensure this line is present
});
