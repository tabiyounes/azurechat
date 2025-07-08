import { ChatCompletionStreamingRunner } from "openai/resources/beta/chat/completions";
import { AzureChatCompletion, AzureChatCompletionAbort } from "../complaints-services/models";
export const ComplaintOpenAIStream = (runner: ChatCompletionStreamingRunner) => {
  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
      async start(controller) {
        const streamResponse = (event: string, value: string) => {
          controller.enqueue(encoder.encode(`event: ${event} \n`));
          controller.enqueue(encoder.encode(`data: ${value} \n\n`));
        };
        let lastMessage = "";
  
        runner
          .on("content", (content) => {
            const completion = runner.currentChatCompletionSnapshot;
  
            if (completion) {
              const response: AzureChatCompletion = {
                type: "content",
                response: completion,
              };
              lastMessage = completion.choices[0].message.content ?? "";
              streamResponse(response.type, JSON.stringify(response));
            }
          })
          .on("functionCall", async (functionCall) => {
          const response: AzureChatCompletion = {
              type: "functionCall",
              response: functionCall,
            };
            streamResponse(response.type, JSON.stringify(response));
          })
          .on("functionCallResult", async (functionCallResult) => {
            const response: AzureChatCompletion = {
              type: "functionCallResult",
              response: functionCallResult,
            };
            streamResponse(response.type, JSON.stringify(response));
          })
          .on("abort", (error) => {
            const response: AzureChatCompletionAbort = {
              type: "abort",
              response: "Chat aborted",
            };
            streamResponse(response.type, JSON.stringify(response));
            controller.close();
          })
          .on("error", async (error) => {
            console.log("🔴 error", error);
            const response: AzureChatCompletion = {
              type: "error",
              response: error.message,
            };
  
            streamResponse(response.type, JSON.stringify(response));
            controller.close();
          })
          .on("finalContent", async (content: string) => {
  
            const response: AzureChatCompletion = {
              type: "finalContent",
              response: content,
            };
            streamResponse(response.type, JSON.stringify(response));
            controller.close();
          });
      },
    });
  
    return readableStream;
  };
  