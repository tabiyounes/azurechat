import { proxy, useSnapshot } from "valtio";
import { ParsedEvent, ReconnectInterval, createParser } from "eventsource-parser";

class ComplaintsState {
  public loading: "idle" | "loading" = "idle";
  public suggestion: string = "";
  public error: string = "";

  public async submitComplaint(formData: FormData) {
    this.loading = "loading";
    this.suggestion = "";
    this.error = "";

    try {
      const response = await fetch("/api/complaint", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `HTTP error! status: ${response.status}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const data = await response.json();
        this.suggestion = data.response || data.message || data.content || "";
      } else if (contentType?.includes("text/event-stream")) {
        await this.handleStreamingResponse(response);
      } else {
        const text = await response.text();
        this.suggestion = text;
      }
    } catch (error) {
      console.error("Error:", error);
      this.error = error instanceof Error ? error.message : "Unknown error";
    } finally {
      this.loading = "idle";
    }
  }

  private async handleStreamingResponse(response: Response) {
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let fullContent = "";

    const parser = createParser((event: ParsedEvent | ReconnectInterval) => {
      if (event.type === "event" && event.data !== "[DONE]") {
        try {
          const data = JSON.parse(event.data);
          const content = data.choices?.[0]?.delta?.content || 
                         data.response || 
                         data.content || 
                         "";
          if (content) {
            fullContent += content;
            this.suggestion = fullContent;
          }
        } catch {
          // If not JSON, treat as plain text
          fullContent += event.data;
          this.suggestion = fullContent;
        }
      }
    });

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        parser.feed(decoder.decode(value));
      }
    } finally {
      reader.releaseLock();
    }
  }
}

export const complaintsStore = proxy(new ComplaintsState());
export const useComplaints = () => useSnapshot(complaintsStore);