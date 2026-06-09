import { LlmAgent, InMemoryRunner, Gemini } from '@google/adk';

import { Agent } from '@stateflowx/common';

export class GoogleADKAgent implements Agent {
  constructor(
    public readonly name: string,
    public readonly priority?: number
  ) { }

  async execute(payload?: unknown): Promise<unknown> {
    console.log('[ADK PAYLOAD]', payload);

    const input = payload as {
      prompt?: string;
      data?: unknown;
      apiKey?: string;
    };

    console.log('[INPUT PROMPT]', input.prompt);

    const model = new Gemini({
      model: 'gemini-2.5-flash',
      apiKey: input?.apiKey,
    });

    const agent = new LlmAgent({
      name: this.name,

      model: model,

      instruction: input?.prompt,
    });

    const runner = new InMemoryRunner({
      agent,
    });

    let finalText = '';

    // console.log(
    //   JSON.stringify(
    //     event,
    //     null,
    //     2
    //   )
    // );

    for await (const event of runner.runEphemeral({
      userId: 'stateflowx',

      newMessage: {
        parts: [
          {
            text: input.prompt ?? 'Hello',
          },
        ],
      },
    })) {
      console.log('[PARTS]', JSON.stringify(event.content?.parts, null, 2));

      console.log('[ADK EVENT]', event);

      const text = event.content?.parts
        ?.map((part: any) => part?.text)
        ?.filter(Boolean)
        ?.join('\n');

      if (text) {
        finalText = text;
      }
    }

    console.log('[ADK RESULT]', finalText);

    return finalText;
  }
}

// import {
//   LlmAgent,
//   InMemoryRunner,
// } from '@google/adk';

// import { Agent } from '@stateflowx/common';

// export class GoogleADKAgent
//   implements Agent {

//   constructor(
//     public readonly name: string,
//     public readonly priority?: number,
//   ) { }

//   async execute(
//     payload?: unknown,
//   ): Promise<unknown> {

//     const input =
//       payload as {
//         prompt?: string;
//       };

//     const agent =
//       new LlmAgent({
//         name: this.name,

//         model:
//           'gemini-2.5-flash',

//         instruction:
//           'You are a helpful assistant.',
//       });

//     const runner =
//       new InMemoryRunner({
//         agent,
//       });

//     const events = [];

//     for await (
//       const event of runner.runEphemeral({
//         userId: 'stateflowx',

//         newMessage: {
//           parts: [
//             {
//               text:
//                 input.prompt ??
//                 'Hello',
//             },
//           ],
//         },
//       })
//     ) {
//       console.log(
//         '[ADK EVENT]',
//         event
//       );

//       events.push(event);
//     }

//     return JSON.stringify(
//       events,
//       null,
//       2
//     );
//   }
// }

// // export class GoogleADKAgent implements Agent {

// //   constructor(
// //     public readonly name: string,
// //     public readonly priority?: number,
// //   ) {}

// //   async execute(
// //     payload?: unknown,
// //   ): Promise<unknown> {

// //     return {
// //       provider: 'google-adk',
// //       payload,
// //     };
// //   }
// // }
