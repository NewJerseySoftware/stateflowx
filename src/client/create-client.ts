import { JSONRPCClient } from 'json-rpc-2.0';

export function createClient(config: any) {
  const socket = new WebSocket(
    config.transport.url
  );

  const rpc = new JSONRPCClient((request) => {
    socket.send(JSON.stringify(request));

    return Promise.resolve();
  });

  socket.onmessage = (event) => {
    rpc.receive(JSON.parse(event.data));
  };

  return {
    request(method: string, params: any) {
      return rpc.request(method, params);
    },
  };
}