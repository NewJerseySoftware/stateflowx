import WebSocket from 'ws';
import readline from 'readline';

const ws = new WebSocket('ws://localhost:3000');

let id = 1;

ws.on('open', () => {
  console.log('Connected to server');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('line', (input) => {
    const command = input.trim();

    if (command.startsWith('do:')) {
      const method = command.replace('do:', '').trim();

      const payload = {
        jsonrpc: '2.0',
        method,
        id: id++,
      };

      ws.send(JSON.stringify(payload));
    }
  });
});

ws.on('message', (data) => {
  console.log('Response:', data.toString());
});

ws.on('close', () => {
  console.log('Disconnected');
});