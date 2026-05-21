import { describe, expect, it } from '@jest/globals';

import { JSONRPCServer } from 'json-rpc-2.0';

import { createRuntime } from './core/runtime/create-runtime.js';
import { bootstrapRuntime } from './core/runtime/bootstrap.js';

import { JsonRpcProtocol } from './core/protocol/json-rpc/json-rpc.protocol.js';

import { HttpTransport } from './core/transport/http/http.transport.js';

import { RuntimeInitializeApp } from './core/runtime/runtime-app-init.js';

describe('Runtime HTTP Transport', () => {
    it('should initialize and execute workflow over HTTP transport', async () => {
        const transport = new HttpTransport();

        const protocol = new JsonRpcProtocol(new JSONRPCServer());

        const runtime = createRuntime({
            transport,

            protocol,

            providers: [],

            services: [],
        });

        bootstrapRuntime([new RuntimeInitializeApp()], runtime);

        //
        // Initialize runtime
        //
        const initializeResponse = await transport.handleRequest({
            jsonrpc: '2.0',

            method: 'runtime.initialize',

            params: {
                services: [
                    {
                        name: 'ping',

                        type: 'http',

                        method: 'GET',

                        url: 'https://example.com',
                    },
                ],

                workflows: [
                    {
                        route: 'ping.execute',

                        service: 'ping',

                        provider: 'default',

                        prompt: 'Return pong',
                    },
                ],
            },

            id: 1,
        });

        expect(initializeResponse).toEqual({
            jsonrpc: '2.0',

            id: 1,

            result: {
                success: true,
            },
        });
    });

    it('should initialize and execute workflow over HTTP transport', async () => {
        const transport = new HttpTransport();

        const protocol = new JsonRpcProtocol(new JSONRPCServer());

        const runtime = createRuntime({
            transport,

            protocol,

            providers: [],

            services: [],
        });

        bootstrapRuntime([new RuntimeInitializeApp()], runtime);

        //
        // Initialize runtime
        //
        const initializeResponse = await transport.handleRequest({
            jsonrpc: '2.0',

            method: 'runtime.initialize',

            params: {
                services: [
                    {
                        name: 'ping',

                        type: 'http',

                        method: 'GET',

                        url: 'https://example.com',
                    },
                ],

                workflows: [
                    {
                        route: 'ping.execute',

                        service: 'ping',

                        provider: 'default',

                        prompt: 'Return pong',
                    },
                ],
            },

            id: 1,
        });

        expect(initializeResponse).toEqual({
            jsonrpc: '2.0',

            id: 1,

            result: {
                success: true,
            },
        });
    });
});
