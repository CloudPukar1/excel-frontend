import { IUser } from "@/types/User";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type IProfileAvatarProps = {
  user: IUser;
  logout: () => void;
};

export default function ProfileAvatar({
  user: { name, colorCode },
  logout,
}: IProfileAvatarProps) {
  return (
    <Avatar>
      <AvatarFallback className={`bg-${colorCode}`}>{name}</AvatarFallback>
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Avatar>
  );
}
