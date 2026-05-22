import { Module } from '@nestjs/common';

import { HttpTransport } from './core/transport/http/http.transport.js';

import { HttpRpcController } from './core/transport/http/http.controller.js';

@Module({
    providers: [
        HttpTransport,
    ],

    controllers: [
        HttpRpcController,
    ],
})
export class HttpRuntimeModule { }