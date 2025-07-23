"use server";
import "server-only";

import { ChatApiComplaints } from "@/features/complaints-page/chat-api/chat-api-complaints";
import { ComplaintOpenAIStream } from "./complaint-openai-stream";

// Define the expected complaint data structure
interface ComplaintAPIProps {
  causeTechnique: string;
  actionCorrective: string;
  actionClient?: string;
  multimodalImage: string;
}

export const ComplaintAPIEntry = async (
  props: ComplaintAPIProps,  // Changed from UserPrompt to specific complaint type
  signal: AbortSignal
): Promise<Response> => {
  try {
    if (!props.multimodalImage) {
      throw new Error("An image is required for complaint processing");
    }

    // Call your complaint API with the proper data structure
    const runner = await ChatApiComplaints({
      complaintData: {
        causeTechnique: props.causeTechnique,
        actionCorrective: props.actionCorrective,
        actionClient: props.actionClient
      },
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};