"use client";

import { DropdownMenuItemWithIcon } from "@/features/chat-page/chat-menu/chat-menu-item";
import { RevalidateCache } from "@/features/common/navigation-helpers";
import { LoadingIndicator } from "@/features/ui/loading";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { FC, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { PersonaModel } from "../persona-services/models";
import { DeletePersona } from "../persona-services/persona-service";
import { personaStore } from "../persona-store";

interface Props {
  persona: PersonaModel;
}

type DropdownAction = "edit" | "delete";

export const PersonaCardContextMenu: FC<Props> = (props) => {
  const { isLoading, handleAction } = useDropdownAction({
    persona: props.persona,
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {isLoading ? (
            <LoadingIndicator isLoading={isLoading} />
          ) : (
            <MoreVertical size={18} />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItemWithIcon
            onClick={() => personaStore.updatePersona(props.persona)}
          >
            <Pencil size={18} />
            <span>Modifier</span>
          </DropdownMenuItemWithIcon>
          <DropdownMenuItemWithIcon
            onClick={async () => await handleAction("delete")}
          >
            <Trash size={18} />
            <span>Supprimer</span>
          </DropdownMenuItemWithIcon>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const useDropdownAction = (props: { persona: PersonaModel }) => {
  const { persona } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: DropdownAction) => {
    setIsLoading(true);
    switch (action) {
      case "delete":
        if (
          window.confirm(`Êtes-vous sûr de vouloir supprimer ${persona.name} ?`)
        ) {
          await DeletePersona(persona.id);
          RevalidateCache({
            page: "persona",
          });
        }
        break;
    }
    setIsLoading(false);
  };

  return {
    isLoading,
    handleAction,
  };
};
