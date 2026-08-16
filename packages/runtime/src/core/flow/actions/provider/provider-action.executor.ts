import { RuntimeContext } from '../../../runtime/runtime-context.interface.js';
import { ProviderAction } from '../provider-action.interface.js';

export class ProviderActionExecutor {

    constructor(
        private readonly runtime: RuntimeContext
    ) { }

    async execute(
        action: ProviderAction,
        results: Map<string, unknown>
    ): Promise<unknown> {

        let resolvedPrompt = action.prompt;

        for (const connector of action.inputConnectors ?? []) {

            const input =
                results.get(connector.actionId);

            if (input === undefined) {
                throw new Error(
                    `Input not available: ${connector.actionId}`
                );
            }

            resolvedPrompt = resolvedPrompt.replace(
                `{{${connector.actionId}}}`,
                JSON.stringify(input)
            );
        }

        if (action.log) {
            console.log(
                '[RESOLVED PROMPT]',
                resolvedPrompt
            );
        }

        const result =
            await this.runtime.providers.execute(
                action.provider,
                {
                    prompt: resolvedPrompt,
                    apiKey: this.runtime.apiKey,
                }
            );

        return result;
    }
}