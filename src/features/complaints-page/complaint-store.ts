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

    // CORRECTION: Validation des champs obligatoires
    const causeTechnique = formData.get("causeTechnique") as string;
    const actionCorrective = formData.get("actionCorrective") as string;
    const actionClient = formData.get("actionClient") as string;

    // Validation des champs requis
    if (!causeTechnique?.trim()) {
      this.error = "La cause technique est obligatoire.";
      showError(this.error);
      return;
    }

    if (!actionCorrective?.trim()) {
      this.error = "L'action corrective est obligatoire.";
      showError(this.error);
      return;
    }

    const payload = {
      causeTechnique: causeTechnique.trim(),
      actionCorrective: actionCorrective.trim(),
      actionClient: actionClient?.trim() || "Aucune action requise", // CORRECTION: Valeur par défaut
    };

    let image = formData.get("image-base64") as string;
    if (!image?.trim()) {
      this.error = "Veuillez joindre une image avant de soumettre.";
      showError(this.error);
      return;
    }

    // CORRECTION: Validation du format base64
    if (!this.isValidBase64Image(image)) {
      this.error = "Le format de l'image n'est pas valide.";
      showError(this.error);
      return;
    }

    const finalFormData = new FormData();
    finalFormData.append("content", JSON.stringify(payload));
    finalFormData.append("image-base64", image);

    this.chat(finalFormData);
  }

  // AJOUT: Validation du format base64
  private isValidBase64Image(base64String: string): boolean {
    try {
      // Vérifier si c'est un data URL valide
      const dataUrlPattern = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
      return dataUrlPattern.test(base64String);
    } catch {
      return false;
    }
  }

  private async chat(formData: FormData) {
    this.loading = "loading";
    this.suggestion = "";
    this.error = "";
    
    // CORRECTION: Nettoyage du contrôleur précédent
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();

    // Create user message ID upfront
    const userMessageId = uniqueId();
    const assistantMessageId = uniqueId(); // AJOUT: ID pour le message assistant

    try {
      const response = await fetch("/api/complaint", {
        method: "POST",
        body: formData,
        signal: abortController.signal,
        headers: {
          // AJOUT: Headers pour une meilleure gestion
          'Accept': 'text/event-stream',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
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

      // CORRECTION: Initialiser le message assistant vide
      const assistantMessage: ChatMessageModel = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        name: AI_NAME,
        type: "CHAT_MESSAGE",
        userId: "",
        multiModalImage: "",
      };
      this.messages.push(assistantMessage);

      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          try {
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
                // CORRECTION: Mise à jour incrémentale du contenu
                const newContent = responseType.response.choices[0]?.message?.content || "";
                const currentAssistant = this.messages.find(msg => msg.id === assistantMessageId);
                if (currentAssistant) {
                  currentAssistant.content += newContent;
                  this.suggestion = currentAssistant.content;
                }
                break;

              case "abort":
                this.removeMessage(userMessageId);
                this.removeMessage(assistantMessageId);
                this.loading = "idle";
                break;

              case "error":
                const errorMsg = responseType.response || "Erreur inconnue";
                showError(errorMsg);
                this.error = errorMsg;
                this.removeMessage(userMessageId);
                this.removeMessage(assistantMessageId);
                this.loading = "idle";
                break;

              default:
                console.warn("Type de réponse non géré:", responseType.type);
                break;
            }
          } catch (parseError) {
            console.error("Erreur de parsing SSE:", parseError, "Data:", event.data);
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

          if (value) {
            const chunkValue = decoder.decode(value, { stream: true });
            parser.feed(chunkValue);
          }
        }

        this.loading = "idle";
      }
    } catch (error) {
      let errorMessage = "Erreur inconnue";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Requête annulée";
        } else {
          errorMessage = error.message;
        }
      }
      
      console.error("Erreur dans chat():", error);
      showError(errorMessage);
      this.error = errorMessage;
      this.removeMessage(userMessageId);
      this.removeMessage(assistantMessageId);
      this.loading = "idle";
    }
  }

  // CORRECTION: Amélioration du formatage du message utilisateur
  private buildUserMessageContent(payload: any): string {
    return `Formulaire d'expertise :
• Cause technique identifiée : ${payload.causeTechnique || "Non précisée"}
• Action corrective réalisée : ${payload.actionCorrective || "Non précisée"}  
• Action attendue du client : ${payload.actionClient || "Aucune action requise"}`;
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