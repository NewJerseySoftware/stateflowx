import {
  LlmAgent,
  InMemoryRunner,
  Gemini,
} from '@google/adk';

import { Agent } from '@stateflowx/common';

export class GoogleADKAgent implements Agent {

  constructor(
    public readonly name: string,
    public readonly priority?: number
  ) { }

  async execute(
    payload?: unknown
  ): Promise<unknown> {

    const input = payload as {
      prompt?: string;
      data?: unknown;
      apiKey?: string;
    };

    console.log(
      '[ADK INPUT PROMPT]',
      input.prompt
    );

    //
    // Gemini model used by Google ADK
    //
    const model = new Gemini({
      model: 'gemini-2.5-flash',
      apiKey: input?.apiKey,
    });

    //
    // Google ADK agent
    //
    const agent = new LlmAgent({
      name: this.name,
      model,
      instruction: input?.prompt,
    });

    //
    // Ephemeral ADK runner
    //
    const runner = new InMemoryRunner({
      agent,
    });

    let eventCount = 0;
    let responseText: string | undefined;

    //
    // Execute through Google ADK.
    //
    for await (
      const event of runner.runEphemeral({
        userId: 'stateflowx',

        newMessage: {
          parts: [
            {
              text:
                input.prompt ??
                'Hello',
            },
          ],
        },
      })
    ) {

      eventCount++;

      console.log(
        `[ADK EVENT ${eventCount}]`,
        JSON.stringify(
          event,
          null,
          2
        )
      );

      //
      // Surface ADK/model errors.
      //
      if (event.errorCode) {
        throw new Error(
          event.errorMessage ??
          event.errorCode
        );
      }

      //
      // Capture text produced by the model.
      //
      const textPart =
        event.content?.parts?.find(
          (part: any) =>
            typeof part.text ===
            'string'
        );

      if (
        textPart &&
        event.author !== 'user'
      ) {
        responseText =
          textPart.text;
      }
    }

    if (responseText) {
      console.log(
        '[ADK RESPONSE]',
        responseText
      );

      return responseText;
    }

    throw new Error(
      `Google ADK completed without a response after ${eventCount} events.`
    );
  }
}
