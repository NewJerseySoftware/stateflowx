import {
  LlmAgent,
  InMemoryRunner,
  Gemini,
  AgentRegistry,
} from '@google/adk';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { Agent } from '@stateflowx/common';


//
// Hackathon Note:
//
// ADK successfully invokes MCP tools,
// however subsequent model continuation
// occasionally fails with:
//
// "function call turn comes immediately..."
//
// When this occurs we log the MCP result
// and fall back to a direct Gemini call
// so the StateFlowX workflow can continue.
//

export class GoogleADKAgent implements Agent {

  constructor(
    public readonly name: string,
    public readonly priority?: number
  ) { }

  async execute(payload?: unknown): Promise<unknown> {

    //
    // StateFlowX payload
    //
    console.log('[ADK PAYLOAD]', payload);

    const input = payload as {
      prompt?: string;
      data?: unknown;
      apiKey?: string;
    };

    console.log('[INPUT PROMPT]', input.prompt);

    //
    // Agent Registry client
    //
    // Used to discover MCP servers registered
    // in Google Agent Registry.
    //
    const registry = new AgentRegistry({
      projectId: process.env.GOOGLE_AGENT_REGISTRY_PROJECT_ID!,
      location: process.env.GOOGLE_AGENT_REGISTRY_LOCATION!,
    });

    //
    // Verify MCP server registration.
    //
    // Useful for debugging and proving
    // Agent Registry discovery works.
    //
    const servers =
      await registry.listMcpServers();

    console.log(
      '[MCP SERVERS]',
      JSON.stringify(
        servers,
        null,
        2
      )
    );

    console.log(
      '[LOADING MCP TOOLSET]'
    );

    //
    // Load MCP tools from Agent Registry.
    //
    // ADK exposes the remote MCP server as
    // a toolset which Gemini can invoke.
    //
    const mongodbToolset =
      await registry.getMcpToolset(
        process.env.GOOGLE_AGENT_REGISTRY_MCP_SERVER!
      );

    console.log(
      '[MCP TOOLSET]',
      mongodbToolset
    );

    //
    // Gemini model.
    //
    // API key is supplied at runtime from
    // the StateFlowX execution payload.
    //
    const model = new Gemini({
      model: 'gemini-2.5-flash',
      apiKey: input?.apiKey,
    });

    //
    // Prompt handling.
    //
    // The workflow prompt is currently supplied
    // as both agent instruction and user input.
    //
    // May be simplified after ADK integration
    // stabilizes.
    //
    const agent = new LlmAgent({
      name: this.name,

      model,

      instruction: input?.prompt,

      tools: [
        mongodbToolset,
      ],
    });

    //
    // Ephemeral execution runner
    //
    // Creates a temporary ADK session
    // executes the request, then disposes
    // of the session automatically.
    //
    const runner = new InMemoryRunner({
      agent,
    });

    //
    // Track the last successful MCP tool response.
    //
    // Used as a fallback when Gemini fails to
    // continue execution after a valid MCP
    // function response.
    //
    let lastFunctionResponse: any = null;

    //
    // Debug counter used to inspect the
    // ADK event stream.
    //
    let eventCount = 0;

    //
    // Event Stream
    //
    // Typical observed sequence :
    //
    // Event 1:
    //   Gemini issues MCP function call
    //
    // Event 2:
    //   MCP function response returned
    //
    // Event 3:
    //   Gemini attempts continuation
    //
    // Current observed failure:
    //
    //   400
    //   "Please ensure that function call
    //    turn comes immediately after a
    //    user turn or after a function
    //    response turn."
    //
    //
    // Workaround:
    //
    // If we successfully received a valid
    // MCP function response and then hit
    // the observed ADK continuation error,
    // log the MCP result and fall back to
    // a direct Gemini invocation so the
    // workflow can still complete.
    //
    //
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

      eventCount++;

      console.log(
        `[ADK EVENT ${eventCount}]`,
        JSON.stringify(event, null, 2)
      );

      //
      // Capture MCP function responses.
      //
      const functionResponse =
        event.content?.parts?.find(
          (part: any) => part.functionResponse
        );

      if (functionResponse) {

        lastFunctionResponse =
          functionResponse.functionResponse;

        console.log(
          '[MCP FUNCTION RESPONSE]',
          JSON.stringify(
            lastFunctionResponse,
            null,
            2
          )
        );
      }

      //
      // Capture ADK / Gemini errors..
      //
      if (event.errorCode) {

        console.error(
          '[ADK ERROR]',
          event.errorCode,
          event.errorMessage
        );

        const isKnownContinuationError =
          event.errorMessage?.includes(
            'function call turn comes immediately'
          );

        //
        // Observed ADK MCP continuation error.
        //
        // After a successful MCP tool response,
        // Gemini sometimes returns ->
        //
        // "Please ensure that function call turn
        // comes immediately after a user turn or
        // after a function response turn."
        //
        // Until root cause is identified we fall
        // back to a direct Gemini invocation.
        if (
          isKnownContinuationError &&
          lastFunctionResponse
        ) {

          console.error(
            '[ADK MCP CONTINUATION ERROR]',
            JSON.stringify(
              lastFunctionResponse,
              null,
              2
            )
          );

          console.warn(
            '[ADK WORKAROUND]',
            'Falling back to direct Gemini call'
          );

          return this.workaround(
            input.prompt ?? '',
            input.apiKey
          );
        }

        return JSON.stringify({
          error: event.errorCode,
          message: event.errorMessage,
          eventCount,
        });
      }
    }

    //
    // Runner completed without producing
    // an error or final text response.
    //
    return JSON.stringify({
      success: false,
      eventCount,
      message:
        'ADK execution completed without a final response.',
    });
  }


  private async workaround(
    prompt: string,
    apiKey?: string
  ): Promise<string> {

    console.log(
      '[ADK WORKAROUND]',
      'Executing direct Gemini request'
    );

    const genAI =
      new GoogleGenerativeAI(
        apiKey ??
        process.env.GEMINI_API_KEY!
      );

    const model =
      genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });

    const result =
      await model.generateContent(
        prompt
      );

    const text =
      result.response.text();

    console.log(
      '[ADK WORKAROUND RESPONSE]',
      text
    );

    return text;
  }
}