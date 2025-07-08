import { z } from "zod";
import { ChatCompletionSnapshot } from "openai/lib/ChatCompletionStream";
import { ChatCompletionMessage } from "openai/resources/chat/completions";

export const CHAT_DOCUMENT_ATTRIBUTE = "CHAT_DOCUMENT";
export const CHAT_THREAD_ATTRIBUTE = "CHAT_THREAD";
export const MESSAGE_ATTRIBUTE = "CHAT_MESSAGE";
export const CHAT_CITATION_ATTRIBUTE = "CHAT_CITATION";
export type ComplaintModel = z.infer<typeof ComplaintModelSchema>;

export const ComplaintModelSchema = z.object({
  id: z.string(),
  userId: z.string(),
  causeTechnique: z
    .string()
    .min(1, "Cause technique est requis."),
  actionCorrective: z
    .string()
    .min(1, "Action corrective est requis."),
  actionClient: z
    .string()
    .optional(),
  createdAt: z.date(),
});

export interface UserPrompt {
  id: string; 
  message: string;
  multimodalImage: string;
}

export type ChatRole = "system" | "user" | "assistant" | "function" | "tool";
export interface ChatMessageModel {
  id: string;
  userId: string;
  content: string;
  role: ChatRole;
  name: string;
  multiModalImage?: string;
  type: typeof MESSAGE_ATTRIBUTE;
}

export type AzureChatCompletionFunctionCall = {
  type: "functionCall";
  response: ChatCompletionMessage.FunctionCall;
};

export type AzureChatCompletionFunctionCallResult = {
  type: "functionCallResult";
  response: string;
};

export type AzureChatCompletionContent = {
  type: "content";
  response: ChatCompletionSnapshot;
};

export type AzureChatCompletionFinalContent = {
  type: "finalContent";
  response: string;
};

export type AzureChatCompletionError = {
  type: "error";
  response: string;
};

export type AzureChatCompletionAbort = {
  type: "abort";
  response: string;
};

export type AzureChatCompletion =
  | AzureChatCompletionError
  | AzureChatCompletionFunctionCall
  | AzureChatCompletionFunctionCallResult
  | AzureChatCompletionContent
  | AzureChatCompletionFinalContent
  | AzureChatCompletionAbort;