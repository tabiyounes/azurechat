"use client";
import { FC, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { ComplaintHero } from "./complaint-hero";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "@/features/ui/label";
import { ImageInput } from "@/features/ui/complaint/complaint-input-area/image-input";
import { complaintsStore, useComplaints } from "@/features/complaints-page/complaint-store";

interface ComplaintPageProps {}

export const ComplaintPage: FC<ComplaintPageProps> = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { suggestion, loading, error } = useComplaints();

  return (
    <ScrollArea className="flex-1">
      <main className="flex flex-col flex-1">
        <ComplaintHero />
        <form
          ref={formRef}
          onSubmit={async (e) => {
            e.preventDefault();
            await complaintsStore.submitComplaint(e);
          }}
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
                    disabled={loading === "loading"}
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
                    disabled={loading === "loading"}
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
                    disabled={loading === "loading"}
                  />
                </div>

                <div className="flex gap-4 items-center">
                <Button type="submit" disabled={loading === "loading"} className="flex-1">
                  {loading === "loading" ? "Envoi..." : "Soumettre"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-1/3"
                  onClick={() => complaintsStore.resetForm(formRef.current)}
                  disabled={loading === "loading"}
                >
                  Nouveau
                </Button>
              </div>
              </div>
            </div>

            {/* Right side: AI suggestion */}
            <div className="w-full md:w-2/5 bg-muted border rounded-xl p-4 h-fit">
              <h2 className="text-lg font-semibold mb-2">Réponse suggérée</h2>
              {error ? (
                <p className="text-sm text-red-500 whitespace-pre-line">{error}</p>
              ) : (
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {suggestion || "Veuillez remplir le formulaire et soumettre pour générer une réponse."}
                </p>
              )}
            </div>
          </div>
        </form>
      </main>
    </ScrollArea>
  );
};

export default ComplaintPage;