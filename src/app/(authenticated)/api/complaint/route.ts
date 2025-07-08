import { ComplaintAPIEntry } from "@/features/complaints-page/chat-api/chat-api-entry-complaints";
import { UserPrompt } from "@/features/chat-page/chat-services/models";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const content = formData.get("content") as string;
    const multimodalImage = formData.get("image-base64") as string;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "Content is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (parseError) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in content" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userPrompt: UserPrompt = {
      ...parsedContent,
      multimodalImage: multimodalImage || "",
    };

    return await ComplaintAPIEntry(userPrompt, req.signal);
  } catch (error) {
    console.error("Error in POST handler:", error);

    const message = error instanceof Error ? error.message : String(error);

    return new Response(
      JSON.stringify({ error: "Internal server error", details: message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}