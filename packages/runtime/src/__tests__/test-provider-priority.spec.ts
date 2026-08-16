import { describe, expect, it, jest } from '@jest/globals';

import { ProviderManager } from '../core/provider/provider.manager.js';
import { AgentProvider } from '../core/provider/provider-execution-request.interface.js';


describe('Provider Priority', () => {

    it('should execute the highest priority provider by default', async () => {

        const openaiExecute = jest.fn(async () => 'openai');
        const geminiExecute = jest.fn(async () => 'gemini');

        const openaiProvider: AgentProvider = {
            execute: openaiExecute,
        };

        const geminiProvider: AgentProvider = {
            execute: geminiExecute,
        };

        const manager = new ProviderManager([
            {
                name: 'gemini',
                provider: geminiProvider,
                priority: 1,
            },
            {
                name: 'openai',
                provider: openaiProvider,
                priority: 2,
            },
        ]);

        const result = await manager.execute(undefined, {
            prompt: 'hello',
        });

        expect(result).toBe('gemini');

        expect(geminiExecute).toHaveBeenCalledTimes(1);
        expect(openaiExecute).not.toHaveBeenCalled();

    });



    it('should retry failed provider before falling back to next provider', async () => {

        const geminiExecute = jest.fn(async () => {
            throw new Error('Gemini failed');
        });

        const openaiExecute = jest.fn(async () => 'openai');

        const geminiProvider: AgentProvider = {
            execute: geminiExecute,
        };

        const openaiProvider: AgentProvider = {
            execute: openaiExecute,
        };

        const manager = new ProviderManager([
            {
                name: 'gemini',
                provider: geminiProvider,
                priority: 1,
            },
            {
                name: 'openai',
                provider: openaiProvider,
                priority: 2,
            },
        ]);

        const result = await manager.execute(undefined, {
            prompt: 'hello',
        });

        expect(result).toBe('openai');

        //  gemini should exhaust its 3 retries
        expect(geminiExecute).toHaveBeenCalledTimes(3);

        // then openai used
        expect(openaiExecute).toHaveBeenCalledTimes(1);

    });

});