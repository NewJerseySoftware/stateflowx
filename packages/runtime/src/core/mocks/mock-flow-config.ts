import { FlowConfig } from '../orchestration/flow/flow.config.js';

export const mockFlows: FlowConfig[] = [
    {
        name: 'Weather Analysis',
        route: 'weather.execute',

        actions: [
            {
                id: 'weather-service',
                type: 'service',
                service: 'weather',
                // log:true,

                outputConnectors: [
                    {
                        actionId: 'weather-provider'
                    }
                ]
            },
            {
                id: 'weather-provider',
                type: 'provider',
                provider: 'gemini',
                // log:true,

                prompt: `
                Return ONLY valid JSON.

                Return exactly one array item.

                Schema:

                [
                    {
                    "city": string,
                    "temperature": number,
                    "condition": string
                    }
                ]

                Use the supplied weather data from {{weather-service}}
                `,
                output: true
            }
        ]
    }
];