import { MenuTrayToggle } from "@/features/main-menu/menu-tray-toggle";
import {
  Menu,
  MenuBar,
  MenuItem,
  MenuItemContainer,
  menuIconProps,
} from "@/ui/menu";
import {
  Book,
  Home,
  MessageCircle,
  PocketKnife,
  Sheet,
  VenetianMask,
  FilePen,
  PawPrint,
} from "lucide-react";
import { getCurrentUser } from "../auth-page/helpers";
import { MenuLink } from "./menu-link";
import { UserProfile } from "./user-profile";

export const MainMenu = async () => {
  const user = await getCurrentUser();

  return (
    <Menu>
      <MenuBar>
        <MenuItemContainer>
          <MenuItem tooltip="Accueil" asChild>
            <MenuLink href="/chat" ariaLabel="Aller à la page d'accueil">
              <Home {...menuIconProps} />
            </MenuLink>
          </MenuItem>
          <MenuTrayToggle />
        </MenuItemContainer>
        <MenuItemContainer>
          <MenuItem tooltip="Chat">
            <MenuLink href="/chat" ariaLabel="Aller à la page de chat">
              <MessageCircle {...menuIconProps} />
            </MenuLink>
          </MenuItem>
          <MenuItem tooltip="Personas">
            <MenuLink href="/persona" ariaLabel="Aller à la page de configuration des personas">
              <VenetianMask {...menuIconProps} />
            </MenuLink>
          </MenuItem>

          <MenuItem tooltip="Prompts">
            <MenuLink href="/prompt" ariaLabel="Aller à la bibliothèque de prompts">
              <Book {...menuIconProps} />
            </MenuLink>
          </MenuItem>

          <MenuItem tooltip="Réclamations">
            <MenuLink href="/complaints" ariaLabel="Aller à la page des réclamations">
              <FilePen {...menuIconProps} />
            </MenuLink>
          </MenuItem>
                        
          <MenuItem tooltip="Gen photo chien">
            <MenuLink href="/dog-generator" ariaLabel="Aller à la page de génération de chiens">
              <PawPrint {...menuIconProps} />
            </MenuLink>
          </MenuItem>
          {user.isAdmin && (
            <>
              <MenuItem tooltip="Extensions">
                <MenuLink href="/extensions" ariaLabel="Aller à la page des extensions">
                  <PocketKnife {...menuIconProps} />
                </MenuLink>
              </MenuItem>
              <MenuItem tooltip="Rapports">
                <MenuLink href="/reporting" ariaLabel="Aller à la page d'administration des rapports">
                  <Sheet {...menuIconProps} />
                </MenuLink>
              </MenuItem>
            </>
          )}
        </MenuItemContainer>
        <MenuItemContainer>
          <MenuItem tooltip="Profil">
            <UserProfile />
          </MenuItem>
        </MenuItemContainer>
      </MenuBar>
    </Menu>
  );
};
