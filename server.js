const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let drawnNumbers = [];
let cinkoAchieved = false;
let ciftCinkoAchieved = false;
let gameStarted = false;

app.use(express.static('public'));

wss.on('connection', (ws) => {
    console.log('New client connected');
    ws.send(JSON.stringify({ type: 'init', drawnNumbers, cinkoAchieved, ciftCinkoAchieved, gameStarted }));

    ws.on('message', (message) => {
        console.log('Received message:', message);
        const data = JSON.parse(message);
        if (data.type === 'drawNumber' && gameStarted) {
            drawNumber(ws);
        } else if (data.type === 'startGame') {
            gameStarted = true;
            broadcast({ type: 'startGame' });
        } else if (data.type === 'resetGame') {
            resetGame();
            broadcast({ type: 'resetGame' });
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
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
}

function resetGame() {
    drawnNumbers = [];
    cinkoAchieved = false;
    ciftCinkoAchieved = false;
    gameStarted = false;
}

function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
