"use client";
import { AddExtension } from "@/features/extensions-page/add-extension/add-new-extension";
import { ExtensionCard } from "@/features/extensions-page/extension-card/extension-card";
import { ExtensionModel } from "@/features/extensions-page/extension-services/models";
import { PersonaCard } from "@/features/persona-page/persona-card/persona-card";
import { PersonaModel } from "@/features/persona-page/persona-services/models";
import { AI_DESCRIPTION, AI_NAME } from "@/features/theme/theme-config";
import { Hero } from "@/features/ui/hero";
import { HomeActionCard } from "./HomeActionCard";
import { Book, VenetianMask, PocketKnife, FilePen, MessageCircle } from "lucide-react";
import { ScrollArea } from "@/features/ui/scroll-area";
import Image from "next/image";
import { FC } from "react";
import { CreateChatAndRedirect } from "../chat-page/chat-services/chat-thread-service";

interface ChatPersonaProps {
  personas: PersonaModel[];
  extensions: ExtensionModel[];
  user?: { isAdmin?: boolean,
    roles?: string[]; };
}

export const ChatHome: FC<ChatPersonaProps> = (props) => {
  const { user } = props; 
  
  const handleNewChat = async () => {
    try {
      await CreateChatAndRedirect();
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  };

  return (
    <ScrollArea className="flex-1">
      <main className="flex flex-1 flex-col gap-6 pb-6">
        <Hero
          title={
            <>
              <Image
                src={"/ai-icon.png"}
                width={60}
                height={60}
                quality={100}
                alt="icône-ia"
              />{" "}
              {AI_NAME}
            </>
          }
          description={AI_DESCRIPTION}
        />
        
        <div className="container max-w-4xl flex gap-20 flex-col">
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-bold mb-3">Navigation rapide</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <HomeActionCard
                title="Nouveau Chat"
                icon={MessageCircle}
                onClick={handleNewChat}
                description="Posez toutes vos questions et obtenez des réponses intelligentes sur n'importe quel sujet professionnel"
                button_title = "Démarrer"
              />
              <HomeActionCard
                title="Personas"
                icon={VenetianMask}
                href="/persona"
                description="Créer et gérer les profils IA"
                button_title = "Ouvrir"
              />
              {user?.roles?.includes("poc") && (
                <HomeActionCard
                  title="Réclamations"
                  icon={FilePen}
                  href="/complaints"
                  description="Formulez des réponses professionnelles et adaptées aux réclamations clients"
                  button_title="Répondre"
                />
              )}

            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-3">Extensions</h2>
            {props.extensions && props.extensions.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {props.extensions.map((extension) => (
                  <ExtensionCard
                    extension={extension}
                    key={extension.id}
                    showContextMenu={false}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground max-w-xl">
                Aucune extension créée
              </p>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-3">Personas</h2>
            {props.personas && props.personas.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {props.personas.map((persona) => (
                  <PersonaCard
                    persona={persona}
                    key={persona.id}
                    showContextMenu={false}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground max-w-xl">
                Aucun profil créé
              </p>
            )}
          </div>
        </div>
        
        <AddExtension />
      </main>
    </ScrollArea>
  );
};