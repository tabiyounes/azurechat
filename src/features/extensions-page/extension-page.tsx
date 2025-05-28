import { FC } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { AddExtension } from "./add-extension/add-new-extension";
import { ExtensionCard } from "./extension-card/extension-card";
import { ExtensionHero } from "./extension-hero/extension-hero";
import { ExtensionModel } from "./extension-services/models";
import {adminPage} from "./extension-services/extension-service";
import { DisplayError } from "../ui/error/display-error";

interface Props {
  extensions: ExtensionModel[];
}

export const ExtensionPage: FC<Props> = async (props) => {
  const isadmin = await adminPage();
  if (isadmin.status !== "OK") {
    return <DisplayError errors={isadmin.errors} />;
  }
  return (
    <ScrollArea className="flex-1">
      <main className="flex flex-1 flex-col">
        <ExtensionHero />
        <div className="container max-w-4xl py-3">
          <div className="grid grid-cols-3 gap-3">
            {props.extensions.map((extension) => {
              return (
                <ExtensionCard
                  extension={extension}
                  key={extension.id}
                  showContextMenu
                />
              );
            })}
          </div>
        </div>
        <AddExtension />
      </main>
    </ScrollArea>
  );
};
