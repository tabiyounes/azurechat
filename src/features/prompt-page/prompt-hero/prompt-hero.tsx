"use client";
import { Hero, HeroButton } from "@/features/ui/hero";
import { Book, BookImage, NotebookPen } from "lucide-react";
import { promptStore } from "../prompt-store";

export const PromptHero = () => {
  return (
    <Hero
      title={
        <>
          <Book size={36} strokeWidth={1.5} /> Bibliothèque de Prompts
        </>
      }
      description={
        "Les modèles de prompt sont des instructions ou questions destinées à aider les utilisateurs à être créatifs sans avoir à partir de zéro."
      }
    >
      <HeroButton
        title="Ajouter un Prompt"
        description="Créez votre propre modèle de prompt"
        icon={<Book />}
        onClick={() => promptStore.newPrompt()}
      />
      <HeroButton
        title="Ville Féérique"
        description="Image d'une ville miniature et colorée"
        icon={<BookImage />}
        onClick={() =>
          promptStore.updatePrompt({
            createdAt: new Date(),
            id: "",
            name: "Ville Féérique",
            description:
              "Créez une ville miniature avec des bâtiments colorés et des arbres verts autour d’un [bâtiment emblématique]. Le [bâtiment emblématique] est au centre de l’image, entouré d’un arrière-plan flou rempli de [nom d’arbre local]. L’image a une ambiance féérique et onirique, avec une faible profondeur de champ et une vue en plongée. La ville ressemble à un jouet ou une maquette, avec des styles de bâtiments variés.",
            isPublished: false,
            type: "PROMPT",
            userId: "",
          })
        }
      />
      <HeroButton
        title="Cadrage du Problème"
        description="Cadrage de problème pour un nouveau produit"
        icon={<NotebookPen />}
        onClick={() =>
          promptStore.updatePrompt({
            createdAt: new Date(),
            id: "",
            name: "Cadrage du Problème",
            description: `
Énoncé du problème :
[ÉNONCÉ DU PROBLÈME]

Générez une réponse avec les éléments suivants :
1. Cadrage du problème
2. Vue d'ensemble de la solution et recommandations 
3. Liste des éléments proposés pour le MVP
4. Comment assurer l’adoption utilisateur
5. Comment mesurer le succès
6. Produits similaires existants
7. Questions potentielles d’un sponsor (5 questions)
              `,
            isPublished: false,
            type: "PROMPT",
            userId: "",
          })
        }
      />
    </Hero>
  );
};
