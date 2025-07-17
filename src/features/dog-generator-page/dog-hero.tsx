import { Hero } from "../ui/hero";
import { PawPrint } from "lucide-react"; // Icône pour illustrer l’image générée

export const DogHero = () => {
  return (
    <Hero
      title={
        <>
          <PawPrint className="mr-2" /> Générateur de Chien
        </>
      }
      description="Décrivez le chien que vous souhaitez générer. Une image sera créée automatiquement."
    />
  );
};
