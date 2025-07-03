import { ComplaintAPIEntry } from "@/features/complaints-page/chat-api/chat-api-entry-complaints";
import { UserPrompt } from "@/features/chat-page/chat-services/models";

export async function POST(req: Request) {
  const formData = await req.formData();
  const content = formData.get("content") as unknown as string;
  const multimodalImage = formData.get("image-base64") as unknown as string;

  const userPrompt: UserPrompt = {
    ...JSON.parse(content),
    multimodalImage,
  };

  return await ComplaintAPIEntry(userPrompt, req.signal);
}
