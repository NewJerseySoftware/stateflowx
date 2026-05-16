import WebSocket from 'ws';
import readline from 'readline';

const ws = new WebSocket('ws://localhost:3000');

let id = 1;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

ws.on('open', () => {
  console.log('Connected to server');
  console.log('Type: do: ping | do: increment');
});

rl.on('line', (input) => {
  const command = input.trim();

  if (!command.startsWith('do:')) {
    console.log('Use format: do: <method>');
    return;
  }

  const method = command.replace('do:', '').trim();

  const payload = {
    jsonrpc: '2.0',
    method,
    id: id++,
  };

  ws.send(JSON.stringify(payload));
});

ws.on('message', (data) => {
  try {
    const parsed = JSON.parse(data.toString());

    if (parsed.error) {
      console.log('error:', parsed.error);
    } else {
      console.log('response:', parsed.data ?? parsed.result);
    }
  } catch {
    console.log('Raw:', data.toString());
  }
});

ws.on('close', () => {
  console.log('Disconnected');
  rl.close();
});

ws.on('error', (err) => {
  console.error('WS Error:', err.message);
});
