"use client";
import { RedirectToPage } from "@/features/common/navigation-helpers";
import { showError } from "@/features/globals/global-message-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/features/ui/dropdown-menu";
import { LoadingIndicator } from "@/features/ui/loading";
import { MoreVertical, Trash } from "lucide-react";
import { useState } from "react";
import { DropdownMenuItemWithIcon } from "./chat-menu-item";
import { DeleteAllChatThreads } from "./chat-menu-service";

export const ChatContextMenu = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer toutes les conversations ?")
    ) {
      setIsLoading(true);
      const response = await DeleteAllChatThreads();

      if (response.status === "OK") {
        setIsLoading(false);
        RedirectToPage("chat");
      } else {
        showError(response.errors.map((e) => e.message).join(", "));
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isLoading}>
        {isLoading ? (
          <LoadingIndicator isLoading={isLoading} />
        ) : (
          <MoreVertical size={18} aria-label="Menu déroulant du chat" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        <DropdownMenuItemWithIcon onClick={async () => await handleAction()}>
          <Trash size={18} />
          <span>Tout supprimer</span>
        </DropdownMenuItemWithIcon>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
