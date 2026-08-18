import { FlowConfig } from "@stateflowx/common";


export const mockFlows:
    FlowConfig[] = [
        {
            name: 'Weather Analysis',
            route: 'weather.execute',
            actions: [
                {
                    id: 'weather-service',
                    type: 'service',
                    service: 'weather',
                    log: true,

                    outputConnectors: [
                        {
                            actionId:
                                'weather-provider',
                        },
                    ],
                },
                {
                    id: 'weather-provider',
                    type: 'provider',
                    provider: 'gemini',
                    log: true,

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


                    outputConnectors: [
                        {
                            actionId:
                                'weather-store',
                        },
                    ],
                },
                {
                    id: 'weather-store',
                    type: 'store',
                    store: 'mysql',
                    operation: 'set',
                    key: 'weather:last-result',
                    log: true,

                    outputConnectors: [
                        {
                            actionId:
                                'weather-consumer',
                        },
                    ],
                },
                {
                    id: 'weather-consumer',
                    type: 'service',
                    service:
                        'weather-consumer',

                    log: true,
                    output: true,
                },
            ],
        },
    ];







// export const mockFlows: FlowConfig[] = [
//     {
//         name: 'Weather Analysis',
//         route: 'weather.execute',

//         actions: [
//             {
//                 id: 'weather-service',
//                 type: 'service',
//                 service: 'weather',
//                 log: true,

//                 outputConnectors: [
//                     {
//                         actionId: 'weather-provider'
//                     }
//                 ]
//             },
//             {
//                 id: 'weather-provider',
//                 type: 'provider',
//                 provider: 'gemini',
//                 log: true,

//                 prompt: `
//                 Return ONLY valid JSON.

//                 Return exactly one array item.

//                 Schema:

//                 [
//                 {
//                     "city": string,
//                     "temperature": number,
//                     "condition": string
//                 }
//                 ]

//                 Use the supplied weather data from {{weather-service}}
//             `,

//                 outputConnectors: [
//                     {
//                         actionId: 'weather-store'
//                     }
//                 ]
//             },
//             {
//                 id: 'weather-store',
//                 type: 'store',
//                 store: 'mysql',
//                 operation: 'set',
//                 key: 'weather:last-result',
//                 log: true,
//                 output: true
//             }
//         ]
//     }
// ];