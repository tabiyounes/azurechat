import { ChatHome } from "@/features/chat-home-page/chat-home";
import { FindAllExtensionForCurrentUser } from "@/features/extensions-page/extension-services/extension-service";
import { FindAllPersonaForCurrentUser } from "@/features/persona-page/persona-services/persona-service";
import { DisplayError } from "@/features/ui/error/display-error";
import { getCurrentUser } from "@/features/auth-page/helpers";

export default async function Home() {
  const [personaResponse, extensionResponse,user] = await Promise.all([
    FindAllPersonaForCurrentUser(),
    FindAllExtensionForCurrentUser(),
    getCurrentUser(),
  ]);

  if (personaResponse.status !== "OK") {
    return <DisplayError errors={personaResponse.errors} />;
  }

  if (extensionResponse.status !== "OK") {
    return <DisplayError errors={extensionResponse.errors} />;
  }
  return (
    <ChatHome
      personas={personaResponse.response}
      extensions={extensionResponse.response}
      user={user}
    />
  );
}
