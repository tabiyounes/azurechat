"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/ui/dropdown-menu";
import { LoadingIndicator } from "@/features/ui/loading";
import { cn } from "@/ui/lib";
import { BookmarkCheck, MoreVertical, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";
import { ChatThreadModel } from "../chat-services/models";
import {
  BookmarkChatThread,
  DeleteChatThreadByID,
  UpdateChatThreadTitle,
} from "./chat-menu-service";

interface ChatMenuItemProps {
  href: string;
  chatThread: ChatThreadModel;
  children?: React.ReactNode;
}

export const ChatMenuItem: FC<ChatMenuItemProps> = (props) => {
  const path = usePathname();
  const { isLoading, handleAction } = useDropdownAction({
    chatThread: props.chatThread,
  });

  return (
    <div className="flex group hover:bg-muted pr-3 text-muted-foreground rounded-sm hover:text-muted-foreground">
      <Link
        href={props.href}
        className={cn(
          "flex-1 flex items-center gap-2 p-3 overflow-hidden",
          path.startsWith(props.href) && props.href !== "/"
            ? "text-primary"
            : ""
        )}
      >
        {props.children}
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger disabled={isLoading}>
          {isLoading ? (
            <LoadingIndicator isLoading={isLoading} />
          ) : (
            <MoreVertical
              size={18}
              aria-label="Menu déroulant de l’élément de chat"
            />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItemWithIcon
            onClick={async () => await handleAction("favori")}
          >
            <BookmarkCheck size={18} />
            <span>
              {props.chatThread.bookmarked
                ? "Retirer des favoris"
                : "Ajouter aux favoris"}
            </span>
          </DropdownMenuItemWithIcon>
          <DropdownMenuItemWithIcon
            onClick={async () => await handleAction("renommer")}
          >
            <Pencil size={18} />
            <span>Renommer</span>
          </DropdownMenuItemWithIcon>
          <DropdownMenuSeparator />
          <DropdownMenuItemWithIcon
            onClick={async () => await handleAction("supprimer")}
          >
            <Trash size={18} />
            <span>Supprimer</span>
          </DropdownMenuItemWithIcon>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

type DropdownAction = "favori" | "renommer" | "supprimer";

const useDropdownAction = (props: { chatThread: ChatThreadModel }) => {
  const { chatThread } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: DropdownAction) => {
    setIsLoading(true);
    switch (action) {
      case "favori":
        await BookmarkChatThread({ chatThread });
        break;
      case "renommer":
        const name = window.prompt(
          "Entrez le nouveau nom de la conversation :"
        );
        if (name !== null) {
          await UpdateChatThreadTitle({ chatThread, name });
        }
        break;
      case "supprimer":
        if (
          window.confirm("Êtes-vous sûr de vouloir supprimer cette conversation ?")
        ) {
          await DeleteChatThreadByID(chatThread.id);
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

export const DropdownMenuItemWithIcon: FC<{
  children?: React.ReactNode;
  onClick?: () => void;
}> = (props) => {
  return (
    <DropdownMenuItem className="flex gap-2" onClick={props.onClick}>
      {props.children}
    </DropdownMenuItem>
  );
};
