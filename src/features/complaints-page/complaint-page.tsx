"use client";
import { FC, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { ComplaintHero } from "./complaint-hero";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "@/features/ui/label";
import { ImageInput } from "@/features/ui/chat/chat-input-area/image-input";
import { ChatInputForm } from "@/features/ui/chat/chat-input-area/chat-input-area";
import { useFileStore } from "../chat-page/chat-input/file/file-store";
import { complaintsStore, useComplaints } from "@/features/complaints-page/complaint-store";
import {
  ChatDocumentModel,
  ChatMessageModel,
  ChatThreadModel,
} from "../chat-page/chat-services/models";
interface ComplaintPageProps {}

export const ComplaintPage: FC<ComplaintPageProps> = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { suggestion, loading } = useComplaints(); // for AI response & loading state

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Grab values from form
    const causeTechnique = formData.get("causeTechnique") as string;
    const actionCorrective = formData.get("actionCorrective") as string;
    const actionClient = formData.get("actionClient") as string;
    const imageBase64 = formData.get("image-base64") as string;

    // Build prompt string
    const prompt = `
Action Technique : ${causeTechnique}
Action Corrective : ${actionCorrective}
Action Client : ${actionClient}
    `.trim();

    complaintsStore.updateInput(prompt);

    // Create API content field as stringified JSON (needed by your backend)
    const content = JSON.stringify({
      message: prompt,
      id: "complaints-thread",
    });

    formData.set("content", content);

    // Submit formData to complaintsStore method that calls API
    await complaintsStore.submitComplaint(formData);
  };

  return (
    <ScrollArea className="flex-1">
      <main className="flex flex-col flex-1">
        <ComplaintHero />
        <form 
          ref={formRef}
          onSubmit={handleSubmit}
           // optional label near form submit button
        >
          <div className="container max-w-6xl py-6 flex flex-col md:flex-row gap-6">
            {/* Left side: form inputs */}
            <div className="flex-1 space-y-6">
              <div className="grid gap-1">
                <Label htmlFor="imageUpload" className="text-lg font-medium">
                  Joindre une image
                </Label>
                <ImageInput />
              </div>

              <div className="grid gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="causeTechnique" className="text-lg font-medium">
                    Action Technique <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="causeTechnique"
                    name="causeTechnique"
                    placeholder="Ex : délais, erreur de gestion, justificatif manquant, problème technique, niveau des garanties…"
                    required
                  />
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="actionCorrective" className="text-lg font-medium">
                    Action Corrective <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="actionCorrective"
                    name="actionCorrective"
                    placeholder="Ex : complément de remboursement de X€, mise à jour des données, traitement du sinistre ce jour… OU contractuel, maintien du refus ou du processus"
                    required
                  />
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="actionClient" className="text-lg font-medium">
                    Action Client
                  </Label>
                  <Textarea
                    id="actionClient"
                    name="actionClient"
                    placeholder="Ex : envoi de document complémentaire… Pas d'action"
                    required
                  />
                </div>

                <Button type="submit" disabled={loading === "loading"}>
                  {loading === "loading" ? "Envoi..." : "Soumettre"}
                </Button>
              </div>
            </div>

            {/* Right side: AI suggestion */}
            <div className="w-full md:w-2/5 bg-muted border rounded-xl p-4 h-fit">
              <h2 className="text-lg font-semibold mb-2">Réponse suggérée</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {suggestion || "Veuillez remplir le formulaire et soumettre pour générer une réponse."}
              </p>
            </div>
          </div>
        </form >
      </main>
    </ScrollArea>
  );
};

export default ComplaintPage;
