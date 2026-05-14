export class WebSocketTransport {

  constructor(
    public client: any,
  ) {}

  send(
    payload: any,
  ) {

    this.client.send(
      JSON.stringify(payload),
    );
  }
}