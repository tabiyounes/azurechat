import { Hero } from "../ui/hero";
import { FilePen } from "lucide-react"; // You can pick another icon


export const ComplaintHero = () => {
  return (
    <Hero
      title={
        <>
          <FilePen className="mr-2" /> Réclamations Client
        </>
      }
      description="Complétez les informations liées à la réclamation. Vous recevrez une suggestion de réponse automatiquement."
    />
  );
};
