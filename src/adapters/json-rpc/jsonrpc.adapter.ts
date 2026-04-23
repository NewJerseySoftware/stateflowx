export const jsonRpcAdapter = {
  register(app, ctx) {
    const server = ctx.transport.jsonrpc;

    Object.entries(app.actions).forEach(([name, handler]) => {
      server.addMethod(name, async (params: any) => {
        const result = await (handler as any)(ctx, params);

        return {
          success: true,
          data: result,
        };
      });
    });
  },
};