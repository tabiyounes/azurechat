import { uniqueId } from "@/features/common/util";
import { HeroButton } from "@/features/ui/hero";
import { FileSearch } from "lucide-react";
import { ExtensionModel } from "../extension-services/models";
import { extensionStore } from "../extension-store";

export const AISearch = () => {
  const newExample = () => {
    const aiSearchExample: ExtensionModel = {
      createdAt: new Date(),
      description: "Azure AI Search",
      id: "",
      name: "Apportez votre propre Azure AI Search",
      executionSteps: `Vous êtes un expert en recherche de documents internes utilisant la fonction aisearch. Vous devez toujours inclure une citation à la fin de votre réponse et ne pas inclure de point final après les citations. Utilisez le format pour votre citation {% citation items=[{name:\\"nom du fichier 1\\",id:\\"id du fichier\\"}, {name:\\"nom du fichier 2\\",id:\\"id du fichier\\"}] /%}`,
      functions: [
        {
          code: `{
"name": "aisearch",
"parameters": {
  "type": "object",
  "properties": {
    "body": {
      "type": "object",
      "description": "Corps de recherche pour des informations pertinentes",
      "properties": {
        "search": {
          "type": "string",
          "description": "La valeur de recherche exacte de l'utilisateur"
        }
      },
      "required": ["search"]
    }
  },
  "required": ["body"]
},
"description": "Vous devez utiliser ceci pour rechercher du contenu basé sur les questions de l'utilisateur."
}`,
          endpoint: "https:AZURE_CHAT_HOST.com/api/document",
          id: uniqueId(),
          endpointType: "POST",
          isOpen: false,
        },
      ],
      headers: [
        {
          id: uniqueId(),
          key: "vectors",
          value: "valeurs,séparées,par,virgules des vecteurs sur l'index",
        },
        {
          id: uniqueId(),
          key: "apiKey",
          value: "VOTRE CLÉ API",
        },
        {
          id: uniqueId(),
          key: "searchName",
          value: "NOM DE AI SEARCH",
        },
        {
          id: uniqueId(),
          key: "indexName",
          value: "NOM DE L'INDEX DE RECHERCHE",
        },
      ],
      isPublished: false,
      type: "EXTENSION",
      userId: "",
    };

    extensionStore.openAndUpdate(aiSearchExample);
  };

  return (
    <HeroButton
      title="Azure AI Search"
      description="Apportez votre propre Azure AI Search"
      icon={<FileSearch />}
      onClick={newExample}
    />
  );
};