import { HeroButton } from "@/features/ui/hero";
import { PocketKnife } from "lucide-react";
import { extensionStore } from "../extension-store";

export const NewExtension = () => {
  return (
    <HeroButton
      title="Nouvelle Extension"
      description="Créez une nouvelle extension avec votre propre API interne"
      icon={<PocketKnife />}
      onClick={() => extensionStore.newAndOpenSlider()}
    />
  );
};