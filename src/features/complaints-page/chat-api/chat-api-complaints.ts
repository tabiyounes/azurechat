"use server";
import "server-only";

import { OpenAIInstance } from "@/features/common/services/openai";
import { ChatCompletionStreamingRunner } from "openai/resources/beta/chat/completions";

// Define your dedicated complaint system prompt here
const COMPLAINT_SYSTEM_PROMPT = `
Vous êtes un assistant IA spécialisé dans la gestion des réclamations clients.
Votre objectif est d'aider les conseillers à reformuler les retours des clients de manière claire,
professionnelle et empathique, tout en respectant les bonnes pratiques de communication.

Basé sur les informations fournies (Action Technique, Action Corrective, Action Client), 
générez une réponse professionnelle et empathique pour le client.

Si une image est fournie, vous devez en extraire les éléments utiles pour comprendre la situation.

Votre réponse doit être:
- Professionnelle et courtoise
- Empathique envers la situation du client
- Claire et précise
- Orientée solution quand c'est possible
- Respectueuse des procédures de l'entreprise
`;

export const ChatApiComplaints = async (props: {
  userMessage: string;
  image: string;
  signal: AbortSignal;
}): Promise<ChatCompletionStreamingRunner> => {
  const { userMessage, image, signal } = props;

  if (!image?.trim()) {      // ❷ hard fail if missing
    throw new Error("An image is required for this endpoint.");
  }

  const openAI = OpenAIInstance();

  return openAI.beta.chat.completions.stream(
    {
      model: "",   
      stream: true,
      max_tokens: 4096,
      messages: [
        {
          role: "system" as const,
          content: COMPLAINT_SYSTEM_PROMPT,
        },
        {
          role: "user" as const,
          content: [          // ❸ always multimodal
            { type: "text", text: userMessage },
            {
              type: "image_url",
              image_url: { url: image },
            },
          ],
        },
      ],
    },
    { signal },
  );
};