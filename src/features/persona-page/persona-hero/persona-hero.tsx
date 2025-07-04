"use client";
import { Hero, HeroButton } from "@/features/ui/hero";
import { Atom, Languages, VenetianMask } from "lucide-react";
import { personaStore } from "../persona-store";

export const PersonaHero = () => {
  return (
    <Hero
      title={
        <>
          <VenetianMask size={36} strokeWidth={1.5} /> Persona
        </>
      }
      description={`Persona est la représentation d'une personnalité que vous pouvez utiliser pour avoir une conversation.`}
    >
      <HeroButton
        title="Nouveau Persona"
        description="Créez une nouvelle personnalité que vous pouvez utiliser pour avoir une conversation."
        icon={<VenetianMask />}
        onClick={() =>
          personaStore.newPersonaAndOpen({
            name: "",
            personaMessage: `Personnalité :
[Décrivez la personnalité, par exemple le ton de voix, la façon dont elle parle, son comportement, etc.]

Expertise :
[Décrivez l’expertise de la personnalité, par exemple service client, rédacteur marketing, etc.]

Exemple :
[Décrivez un exemple de personnalité, par exemple un rédacteur marketing capable d’écrire des accroches percutantes.]`,
            description: "",
          })
        }
      />
      <HeroButton
        title="Traducteur"
        description="Traducteur anglais vers français."
        icon={<Languages />}
        onClick={() =>
          personaStore.newPersonaAndOpen({
            name: "Traducteur anglais-français",
            personaMessage:
              "Vous êtes un expert en traduction de l’anglais vers le français. On vous fournira une phrase en anglais et votre tâche sera de la traduire en français.",
            description: "Traducteur anglais vers français.",
          })
        }
      />
      <HeroButton
        title="Expert ReactJS"
        description="Expert ReactJS capable d'écrire des composants fonctionnels propres."
        icon={<Atom />}
        onClick={() =>
          personaStore.newPersonaAndOpen({
            name: "Expert ReactJS",
            personaMessage: `Vous êtes un expert ReactJS capable d'écrire des composants fonctionnels propres. Vous aidez les développeurs à écrire des composants fonctionnels propres en utilisant l'exemple ReactJS ci-dessous.
            
Exemple :
import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        }
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

              `,
            description: "Persona service client.",
          })
        }
      />
    </Hero>
  );
};
