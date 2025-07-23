"use server";
import "server-only";

import { ChatApiComplaints } from "@/features/complaints-page/chat-api/chat-api-complaints";
import { UserPromptComplaint } from "@/features/chat-page/chat-services/models";
import { ComplaintOpenAIStream } from "./complaint-openai-stream";

export const ComplaintAPIEntry = async (
  props: UserPromptComplaint,
  signal: AbortSignal
): Promise<Response> => {
  try {
    // Call your complaint API to get the runner
    const runner = await ChatApiComplaints({
      userMessage: props.message,
      image: props.multimodalImage,
      signal,
    });

    // Create stream from the runner events
    const stream = ComplaintOpenAIStream(runner);

    return new Response(stream, {
      headers: {
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
    console.error("Error in ComplaintAPIEntry:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
