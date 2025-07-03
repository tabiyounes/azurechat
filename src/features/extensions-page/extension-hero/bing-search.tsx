import { uniqueId } from "@/features/common/util";
import { HeroButton } from "@/features/ui/hero";
import { Globe } from "lucide-react";
import { ExtensionModel } from "../extension-services/models";
import { extensionStore } from "../extension-store";

export const BingSearch = () => {
  const newExample = () => {
    const bingExample: ExtensionModel = {
      createdAt: new Date(),
      description: "Apportez des informations à jour avec Bing Search",
      id: "",
      name: "Bing Search",
      executionSteps: `Vous êtes un expert en recherche web utilisant la fonction BingSearch. `,
      functions: [
        {
          code: `{
"name": "BingSearch",
"parameters": {
  "type": "object",
  "properties": {
    "query": {
      "type": "object",
      "description": "Utilisez ceci comme paramètres de requête de recherche",
      "properties": {
        "BING_SEARCH_QUERY": {
          "type": "string",
          "description": "Requête de recherche de l'utilisateur",
          "example": "Quel est le temps actuel à Sydney, Australie ?"
        }
      },
      "example": {
        "BING_SEARCH_QUERY": "Quel est le temps actuel à Sydney, Australie ?"
      },
      "required": ["BING_SEARCH_QUERY"]
    }
  },
  "required": ["query"]
},
"description": "Utilisez BingSearch pour rechercher des informations sur le web et apporter des informations à jour"
}
          `,
          endpoint:
            "https://api.bing.microsoft.com/v7.0/search?q=BING_SEARCH_QUERY",
          id: uniqueId(),
          endpointType: "GET",
          isOpen: false,
        },
      ],
      headers: [
        {
          id: uniqueId(),
          key: "Ocp-Apim-Subscription-Key",
          value: "VOTRE CLÉ API ICI",
        },
      ],
      isPublished: false,
      type: "EXTENSION",
      userId: "",
    };

    extensionStore.openAndUpdate(bingExample);
  };

  return (
    <HeroButton
      title="Bing Search"
      description="Apportez des informations à jour avec Bing Search"
      icon={<Globe />}
      onClick={newExample}
    />
  );
};