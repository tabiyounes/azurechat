import { ChatCompletionStreamingRunner } from "openai/resources/beta/chat/completions";

export const ComplaintOpenAIStream = (runner: ChatCompletionStreamingRunner) => {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      const sendEvent = (data: string) => {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      runner
        .on("content", (content) => {
          // Use the content parameter directly instead of snapshot
          sendEvent(JSON.stringify({ type: "content", response: content }));
        })
        .on("error", (error) => {
          sendEvent(JSON.stringify({ type: "error", response: error.message }));
          controller.close();
        })
        .on("finalContent", (content: string) => {
          sendEvent(JSON.stringify({ type: "finalContent", response: content }));
          controller.close();
        });
    },
  });
};