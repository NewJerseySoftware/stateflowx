import WebSocket from 'ws';

const socket = new WebSocket('ws://localhost:3000');

socket.on('open', () => {
  console.log('Connected to server');

  const payload = {
    jsonrpc: '2.0',
    method: 'relay-ops.prompt',
    params: {
      prompt: 'Explain what StateFlowX is in one sentence.',
    },
    id: 1,
  };

  console.log('sending:', JSON.stringify(payload, null, 2));

  socket.send(JSON.stringify(payload));
});

socket.on('message', (data) => {
  const response = JSON.parse(data.toString());

  console.log('received:', JSON.stringify(response, null, 2));

  socket.close();
});

socket.on('close', () => {
  console.log('Disconnected');
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});
