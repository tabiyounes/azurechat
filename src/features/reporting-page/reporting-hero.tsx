"use client";
import { Hero } from "@/features/ui/hero";
import { Sheet } from "lucide-react";

export const ReportingHero = () => {
  return (
    <Hero
      title={
        <>
          <Sheet size={36} strokeWidth={1.5} />
          Rapport de Chat
        </>
      }
      description={
        "Vue d'administration pour surveiller l'historique des conversations de tous les utilisateurs"
      }
    ></Hero>
  );
};
