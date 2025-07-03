"use server";
import "server-only";

import { getCurrentUser } from "@/features/auth-page/helpers";
import { CHAT_DEFAULT_SYSTEM_PROMPT } from "@/features/theme/theme-config";
import { ChatCompletionStreamingRunner } from "openai/resources/beta/chat/completions";
import { CreateChatMessage } from "@/features/chat-page/chat-services/chat-message-service";
import { ChatApiComplaints } from "@/features/complaints-page/chat-api/chat-api-complaints";
import { ChatThreadModel, UserPrompt } from "@/features/chat-page/chat-services/models";
import { OpenAIStream } from "@/features/chat-page/chat-services/chat-api/open-ai-stream";
import { EnsureChatThreadOperation } from "@/features/chat-page/chat-services/chat-thread-service";

export const ComplaintAPIEntry = async (
  props: UserPrompt,
  signal: AbortSignal
): Promise<Response> => {
  try {
    
    const currentChatThreadResponse = await EnsureChatThreadOperation(props.id);

    if (currentChatThreadResponse.status !== "OK") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const currentChatThread = currentChatThreadResponse.response;
    
    // Note: Removed the concatenation of CHAT_DEFAULT_SYSTEM_PROMPT since we have a dedicated complaint prompt
    // If you want to keep some default behavior, you can uncomment the line below:
    //currentChatThread.personaMessage = `${CHAT_DEFAULT_SYSTEM_PROMPT} \n\n ${currentChatThread.personaMessage}`;

    const runner: ChatCompletionStreamingRunner = await ChatApiComplaints({
      chatThread: currentChatThread,
      userMessage: props.message,
      image: props.multimodalImage,
      signal : signal,
    });

    const stream = OpenAIStream({
      runner : runner,
      chatThread: currentChatThread,
    });

    return new Response(stream, {
      headers: {
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream"
    },
    });

  } catch (error) {
    console.error("Error in ComplaintAPIEntry:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};