import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/Avatar";
import { ShadButton } from "@/shared/components/ui/ShadButton";
import { Code } from "@/shared/components/ui/Code";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import {
  ShadTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/ShadTooltip";
import {
  isLoadingFriend,
  setShowAddFriend,
  type Friend,
} from "@/split-bill/split-bill-signals";
import { cn, truncate } from "@/shared/utils/helpers";

type FriendItemProps = {
  friend: Friend;
  onDeleteFriend: (friend: Friend) => void;
};

export function FriendItem({ friend, onDeleteFriend }: FriendItemProps) {
  const params = useParams();
  const friendId = Number(params.friendId);
  const selected = friend.id === friendId;

  const name = truncate(friend.name, 5);

  const location = useLocation();
  const navigate = useNavigate();
  const loading = isLoadingFriend();

  function handleToggleSelect() {
    const url = selected
      ? `/split-bill${location.search}`
      : `/split-bill/${friend.id}${location.search}`;

    navigate(url, {
      state: {
        noRefresh: true,
      },
    });

    setShowAddFriend(false);
  }

  return (
    <li
      className={cn(
        "group relative flex items-center justify-between gap-2 rounded px-4 py-2 hover:bg-amber-100 dark:hover:text-slate-950",
        selected && "bg-amber-100 dark:text-night",
      )}
    >
      <ConfirmDialog
        trigger={
          <button className="absolute left-2 top-1 hidden cursor-pointer text-xs group-hover:block">
            ❌
          </button>
        }
        title={
          <span>
            您确定要删除好友 <Code>{friend.name}</Code> 吗？
          </span>
        }
        onConfirm={() => onDeleteFriend(friend)}
      />

      <Avatar>
        <AvatarImage src={friend.image} alt={name} />
        <AvatarFallback>{name}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <TooltipProvider>
          <ShadTooltip>
            <TooltipTrigger asChild>
              <span className="text-lg font-bold">
                {name}
                {` 🎂 `}
                {friend.birthday}
              </span>
            </TooltipTrigger>

            <TooltipContent>{friend.name}</TooltipContent>
          </ShadTooltip>
        </TooltipProvider>

        {friend.balance > 0 && (
          <p className="text-green-500">
            <Code>{name}</Code> 欠您 ${friend.balance}
          </p>
        )}

        {friend.balance < 0 && (
          <p className="text-red-500 dark:text-red-600">
            您欠 <Code>{name}</Code> ${Math.abs(friend.balance)}
          </p>
        )}

        {friend.balance === 0 && (
          <p>
            你和 <Code>{name}</Code> 互不相欠
          </p>
        )}
      </div>

      <ShadButton disabled={loading} onClick={handleToggleSelect}>
        {selected ? "关闭" : "选择"}
      </ShadButton>
    </li>
  );
}
