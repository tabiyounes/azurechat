import { sortByTimestamp } from "@/features/common/util";
import { FC } from "react";
import {
  ChatThreadModel,
  MenuItemsGroup,
  MenuItemsGroupName,
} from "../chat-services/models";
import { ChatGroup } from "./chat-group";
import { ChatMenuItem } from "./chat-menu-item";

interface ChatMenuProps {
  menuItems: Array<ChatThreadModel>;
}

export const ChatMenu: FC<ChatMenuProps> = (props) => {
  const menuItemsGrouped = GroupChatThreadByType(props.menuItems);
  return (
    <div className="px-3 flex flex-col gap-8 overflow-hidden">
      {Object.entries(menuItemsGrouped).map(
        ([groupName, groupItems], index) => (
          <ChatGroup key={index} title={groupName}>
            {groupItems?.map((item) => (
              <ChatMenuItem
                key={item.id}
                href={`/chat/${item.id}`}
                chatThread={item}
              >
                {item.name.replace("\n", "")}
              </ChatMenuItem>
            ))}
          </ChatGroup>
        )
      )}
    </div>
  );
};

export const GroupChatThreadByType = (menuItems: Array<ChatThreadModel>) => {
  const groupedMenuItems: Array<MenuItemsGroup> = [];

  // today's date
  const today = new Date();
  // 7 days ago
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  menuItems.sort(sortByTimestamp).forEach((el) => {
    if (el.bookmarked) {
      groupedMenuItems.push({
        ...el,
        groupName: "Favoris",
      });
    } else if (new Date(el.lastMessageAt) > sevenDaysAgo) {
      groupedMenuItems.push({
        ...el,
        groupName: "7 derniers jours",
      });
    } else {
      groupedMenuItems.push({
        ...el,
        groupName: "Anciens",
      });
    }
  });

  const menuItemsGrouped = groupedMenuItems.reduce((acc, el) => {
    const key = el.groupName;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(el);
    return acc;
  }, {} as Record<MenuItemsGroupName, Array<MenuItemsGroup>>);

  const records: Record<MenuItemsGroupName, Array<MenuItemsGroup>> = {
    Favoris: menuItemsGrouped["Favoris"]?.sort(sortByTimestamp),
    "7 derniers jours": menuItemsGrouped["7 derniers jours"]?.sort(sortByTimestamp),
    Anciens: menuItemsGrouped["Anciens"]?.sort(sortByTimestamp),
  };

  return records;
};
