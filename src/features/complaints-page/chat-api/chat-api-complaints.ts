"use server";
import "server-only";

import { OpenAIInstance } from "@/features/common/services/openai";
import { ChatCompletionStreamingRunner } from "openai/resources/beta/chat/completions";

// PROMPT SYSTÈME CORRIGÉ
const COMPLAINT_SYSTEM_PROMPT = `Tu es un assistant expert en relation client, spécialisé dans la rédaction de courriers de réponse à des réclamations d'assurance. Ton rôle est de rédiger des courriers de réponse professionnels, empathiques, clairs et personnalisés.

**INSTRUCTIONS STRICTES À RESPECTER :**

1. Tu dois OBLIGATOIREMENT te baser UNIQUEMENT sur les éléments techniques fournis dans le formulaire d'expertise
2. Tu ne dois JAMAIS inventer ou ajouter des éléments qui ne figurent pas dans les données techniques
3. Tu dois respecter EXACTEMENT l'action corrective indiquée par l'expert
4. Tu dois ABSOLUMENT RESPECTER un ton professionnel, empathique et rassurant et être clair, concis et bien structuré

**DONNÉES D'ENTRÉE :**
- Image : réclamation du client à analyser
- Formulaire d'expertise avec 3 sections:
  * Cause technique : analyse de la situation par l'expert
  * Action corrective : décision prise (maintien de position OU régularisation)
  * Action client : démarches à réaliser par le client (peut être "aucune")

**STRUCTURE OBLIGATOIRE DE LA RÉPONSE :**

Objet : [Synthèse concise de la réclamation]

Madame, Monsieur,

**Paragraphe 1 - Empathie :**
Choisir UNE SEULE formule selon le contexte :
- "Nous mesurons pleinement les désagréments..."
- "Nous sommes conscients des difficultés..."
- "Nous réalisons l'impact de cette situation..."
- "Nous entendons votre mécontentement..."
- "Nous sommes sensibles à votre situation..."

**Paragraphe 2 - Explication technique :**
Reprendre le contenu de "Cause technique" en l'adaptant au registre client

**Paragraphe 3 - Action corrective :**
RESPECTER STRICTEMENT l'"Action corrective" :
- Si maintien de refus → expliquer clairement le maintien de position
- Si régularisation → expliquer les corrections apportées

**Paragraphe 4 - Instructions client :**
Reprendre EXACTEMENT le contenu d'"Action client"

**RÈGLES CRITIQUES :**
- INTERDIT d'offrir des réévaluations non mentionnées dans "Action corrective"
- INTERDIT de proposer des solutions non listées dans "Action client"
- INTERDIT d'inventer des démarches supplémentaires
- OBLIGATOIRE de maintenir la cohérence avec l'expertise fournie

Ton rôle est de TRADUIRE fidèlement l'expertise technique en langage client clair, pas de réinterpréter ou modifier les décisions.`;

export const ChatApiComplaints = async (props: {
  userMessage: string;
  image: string;
  signal: AbortSignal;
}): Promise<ChatCompletionStreamingRunner> => {
  const { userMessage, image, signal } = props;

  if (!image?.trim()) {
    throw new Error("Une image est requise pour ce point de terminaison.");
  }

  // Validation du modèle
  const MODEL_NAME = ""; // CORRECTION: Spécifier le modèle explicitement
  
  const openAI = OpenAIInstance();

  // CORRECTION: Améliorer la structure du message utilisateur
  let formattedUserMessage = "";
  try {
    const parsed = JSON.parse(userMessage);
    formattedUserMessage = `Formulaire d'expertise :
- Cause technique identifiée : ${parsed.causeTechnique || "Non précisée"}
- Action corrective réalisée : ${parsed.actionCorrective || "Non précisée"}
- Action attendue du client : ${parsed.actionClient || "Aucune action requise"}`;
  } catch (error) {
    // Si le parsing échoue, utiliser le message tel quel
    formattedUserMessage = userMessage;
  }

  return openAI.beta.chat.completions.stream(
    {
      model: MODEL_NAME,   // CORRECTION: Modèle spécifié
      stream: true,
      max_tokens: 2000,    // CORRECTION: Réduit pour éviter les réponses trop longues
      temperature: 0.3,    // CORRECTION: Réduit pour plus de cohérence
      top_p: 0.9,          // AJOUT: Pour plus de contrôle
      presence_penalty: 0, // AJOUT: Éviter la répétition
      frequency_penalty: 0.1, // AJOUT: Légère pénalité sur la fréquence
      messages: [
        {
          role: "system",
          content: COMPLAINT_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: `Veuillez analyser la réclamation client ci-jointe et rédiger une réponse selon les instructions.

${formattedUserMessage}` 
            },
            {
              type: "image_url",
              image_url: { 
                url: image,
                detail: "high" // AJOUT: Analyse détaillée de l'image
              },
            },
          ],
        },
      ],
    },
    { signal },
  );
};