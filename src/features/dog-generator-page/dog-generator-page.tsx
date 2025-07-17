"use client";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { DogHero } from "./dog-hero";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";

export default function DogGeneratorPage() {
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("/placeholder-dog.png"); // Image par défaut
  const [error, setError] = useState("");

  const handleGenerate = () => {
    setError("");
    // Pas d'appel API ici, juste simuler une image changée localement
    setImageUrl("/placeholder-dog.png"); // Tu peux remplacer ça plus tard
  };

  const handleReset = () => {
    setDescription("");
    setImageUrl("");
    setError("");
  };

  return (
    <ScrollArea className="flex-1">
      <main className="flex flex-col items-center py-10 px-4 max-w-2xl mx-auto">
        <DogHero />

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décris le chien que tu veux générer…"
          rows={4}
          className="w-full mt-6"
        />

        <div className="flex gap-4 mt-4">
          <Button onClick={handleGenerate}>Générer</Button>
          <Button variant="secondary" onClick={handleReset}>
            Réinitialiser
          </Button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-4 whitespace-pre-line">{error}</p>
        )}

        {imageUrl && (
          <div className="mt-8">
            <Image
              src={imageUrl}
              alt="Chien généré"
              width={512}
              height={512}
              className="rounded shadow-lg"
            />
          </div>
        )}
      </main>
    </ScrollArea>
  );
}
