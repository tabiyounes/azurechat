import { proxy, useSnapshot } from "valtio";
import { uniqueId } from "@/features/common/util";
import { ParsedEvent, ReconnectInterval, createParser } from "eventsource-parser";
import { ChatMessageModel } from "@/features/chat-page/chat-services/models";

class ComplaintsState {
  public messages: Array<ChatMessageModel> = [];
  public input: string = "";
  public loading: "idle" | "loading" = "idle";
  public suggestion: string = ""; // ✅ Used by the UI

  updateInput(value: string) {
    this.input = value;
  }

  private addToMessages(message: ChatMessageModel) {
    const existing = this.messages.find((m) => m.id === message.id);
    if (existing) {
      existing.content = message.content;
    } else {
      this.messages.push(message);
    }
  }

  public async submitComplaint(formData: FormData) {
    this.loading = "loading";
    this.suggestion = ""; // ✅ Reset before starting

    try {
      const response = await fetch("/api/complaint", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let assistantMessageId = uniqueId();
      let fullContent = "";

      const parser = createParser((event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          try {
            const json = JSON.parse(event.data);
            const content = json.choices?.[0]?.delta?.content || "";
            
            if (content) {
              // ✅ Update the live suggestion string for UI
              this.suggestion += content;
              fullContent += content;
            }
          } catch (error) {
            console.error("Error parsing event data:", error);
          }
        }
      });

      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          parser.feed(chunk);
        }
      }

      // Create final assistant message
      const assistantMessage: ChatMessageModel = {
        id: assistantMessageId,
        role: "assistant",
        content: fullContent,
        name: "Assistant Réclamation",
        createdAt: new Date(),
        isDeleted: false,
        threadId: "complaints-thread",
        type: "CHAT_MESSAGE",
        userId: "",
      };

      this.addToMessages(assistantMessage);

    } catch (error) {
      console.error("Error submitting complaint:", error);
      this.suggestion = "Erreur lors de la génération de la réponse. Veuillez réessayer.";
    } finally {
      this.loading = "idle";
    }
  }
}

export const complaintsStore = proxy(new ComplaintsState());
export const useComplaints = () => useSnapshot(complaintsStore)