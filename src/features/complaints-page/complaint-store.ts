import { proxy, useSnapshot } from "valtio";
import { ParsedEvent, ReconnectInterval, createParser } from "eventsource-parser";
import { FormEvent } from "react";
import { ChatMessageModel } from "./complaints-services/models";
import { uniqueId } from "@/features/common/util";
import { InputImageStore } from "../ui/complaint/complaint-input-area/input-image-store";
import { AzureChatCompletion } from "./complaints-services/models";
import { AI_NAME } from "@/features/theme/theme-config";
import { showError } from "@/features/globals/global-message-store";

let abortController: AbortController = new AbortController();

type chatStatus = "idle" | "loading" | "file upload";

class ComplaintsState {
  public messages: Array<ChatMessageModel> = [];
  public loading: "idle" | "loading" = "idle";
  public suggestion = "";
  public error = "";
  public input: string = "";
  public userName: string = "";

  private addToMessages(message: ChatMessageModel) {
    const currentMessage = this.messages.find((el) => el.id === message.id);
    if (currentMessage) {
      currentMessage.content = message.content;
    } else {
      this.messages.push(message);
    }
  }

  private removeMessage(id: string) {
    const index = this.messages.findIndex((el) => el.id === id);
    if (index > -1) {
      this.messages.splice(index, 1);
    }
  }

  private reset() {
    this.input = "";
    InputImageStore.Reset();
  }
  
  public resetForm(form: HTMLFormElement | null) {
  this.suggestion = "";
  this.error = "";
  this.input = "";
  InputImageStore.Reset();
  if (form) {
    form.reset();
  }
}


  public async submitComplaint(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (this.loading !== "idle") {
      return;
    }

    const formData = new FormData(e.currentTarget);

    const payload = {
      causeTechnique: formData.get("causeTechnique"),
      actionCorrective: formData.get("actionCorrective"),
      actionClient: formData.get("actionClient"),
    };


    let image = formData.get("image-base64") as string;
    if (!image) {
      this.error = "Veuillez joindre une image avant de soumettre.";
      showError(this.error);
      return;
    }
    const finalFormData = new FormData();
    finalFormData.append("content", JSON.stringify(payload));
    if (image) finalFormData.append("image-base64", image);

    this.chat(finalFormData);
  }

  private async chat(formData: FormData) {
    this.loading = "loading";
    this.suggestion = "";
    this.error = "";

    const controller = new AbortController();
    abortController = controller;

    // Create user message ID upfront
    const userMessageId = uniqueId();

    try {
      const response = await fetch("/api/complaint", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Build user message content from the form data
      const content = formData.get("content") as string;
      const parsedContent = JSON.parse(content);
      const userMessageContent = this.buildUserMessageContent(parsedContent);

      const newUserMessage: ChatMessageModel = {
        id: userMessageId,
        role: "user",
        content: userMessageContent,
        name: this.userName,
        multiModalImage: formData.get("image-base64") as string || "",
        type: "CHAT_MESSAGE",
        userId: "",
      };

      this.messages.push(newUserMessage);

      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const responseType = JSON.parse(event.data) as AzureChatCompletion;
          switch (responseType.type) {
            case "functionCall":
              const mappedFunction: ChatMessageModel = {
                id: uniqueId(),
                content: responseType.response.arguments,
                name: responseType.response.name,
                role: "function",
                type: "CHAT_MESSAGE",
                userId: "",
                multiModalImage: "",
              };
              this.addToMessages(mappedFunction);
              break;
            case "functionCallResult":
              const mappedFunctionResult: ChatMessageModel = {
                id: uniqueId(),
                content: responseType.response,
                name: "tool",
                role: "tool",
                type: "CHAT_MESSAGE",
                userId: "",
                multiModalImage: "",
              };
              this.addToMessages(mappedFunctionResult);
                          break;
            case "content":
              const mappedContent: ChatMessageModel = {
                id: uniqueId(),
                content: responseType.response.choices[0].message.content || "",
                name: AI_NAME,
                role: "assistant",
                type: "CHAT_MESSAGE",
                userId: "",
                multiModalImage: "",
              };

              this.addToMessages(mappedContent);
              this.suggestion = mappedContent.content;;
              break;

            case "abort":
              this.removeMessage(userMessageId);
              this.loading = "idle";
              break;

            case "error":
              showError(responseType.response);
              this.error = responseType.response;
              this.removeMessage(userMessageId);
              this.loading = "idle";
              break;

            default:
              break;
          }
        }
      };

      if (response.body) {
        const parser = createParser(onParse);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;

          const chunkValue = decoder.decode(value);
          parser.feed(chunkValue);
        }

        this.loading = "idle";
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      showError(errorMessage);
      this.error = errorMessage;
      this.removeMessage(userMessageId);
      this.loading = "idle";
    }
  }

  private buildUserMessageContent(payload: any): string {
    let content = "Réclamation:\n";
    
    if (payload.causeTechnique) {
      content += `\nAction Technique: ${payload.causeTechnique}`;
    }
    
    if (payload.actionCorrective) {
      content += `\nAction Corrective: ${payload.actionCorrective}`;
    }
    
    if (payload.actionClient) {
      content += `\nAction Client: ${payload.actionClient}`;
    }

    return content;
  }

  public abortRequest() {
    if (abortController) {
      abortController.abort();
      this.loading = "idle";
    }
  }
}

export const complaintsStore = proxy(new ComplaintsState());
export const useComplaints = () => useSnapshot(complaintsStore);