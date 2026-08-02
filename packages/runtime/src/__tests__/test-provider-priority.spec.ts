import { describe, expect, it, jest } from '@jest/globals';

import { ProviderManager } from '../core/provider/provider.manager.js';
import { AgentProvider } from '../core/provider/agent-provider.interface.js';



describe('Provider Priority', () => {

    it('should execute the highest priority provider by default', async () => {

        const highExecute = jest.fn(async () => 'openai');

        const lowExecute = jest.fn(async () => 'gemini');

        const openaiProvider: AgentProvider = {
            execute: highExecute,
        };

        const geminiProvider: AgentProvider = {
            execute: lowExecute,
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
                priority: 100,
            },
        ]);

        const result = await manager.execute(undefined, {
            prompt: 'hello',
        });

        expect(result).toBe('openai');

        expect(highExecute).toHaveBeenCalledTimes(1);

        expect(lowExecute).not.toHaveBeenCalled();

    });

});