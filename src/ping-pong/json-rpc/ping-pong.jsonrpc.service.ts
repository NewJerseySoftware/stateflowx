let counter = 0;

export class PingPongJsonrpcService {
  constructor(private server: any, private ws: any) {}

  public register(): void {
    this.server.addMethod('ping', async () => {
      return {
        success: true,
        data: {
          message: 'pong',
          counter,
          time: Date.now(),
        },
      };
    });

    this.server.addMethod('increment', async () => {
      counter++;

      return {
        success: true,
        data: {
          counter,
        },
      };
    });
  }
}