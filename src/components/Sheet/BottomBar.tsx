import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Plus } from "lucide-react";
import { useSheet } from "@/hooks/useSheet";
// import { useLocation } from "react-router-dom";

export default function BottomBar() {
  const { sheetDetail, handleCreateGrid, handleDeleteGrid } = useSheet();
  // const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  // const gridId = searchParams.get("gridId");

  const { grids = [] } = sheetDetail || {};

  return (
    <div className="fixed flex gap-4 left-0 bottom-0 w-full h-[var(--bottom-bar-height)] pl-4 bg-white after:absolute after:-top-[var(--scrollbar-size)] after:right-0 after:w-[var(--scrollbar-size)] after:h-[var(--scrollbar-size)] after:border-b-light-gray after:border after:bg-white z-50">
      <div className="flex items-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              onClick={handleCreateGrid}
              className="w-8 h-8 rounded-full bg-transparent hover:bg-dark-silver transition-colors"
            >
              <Plus className="cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Menubar className="border-none">
          {grids.map(({ _id, title, color = "transparent" }, index) => (
            <MenubarMenu key={_id}>
              <MenubarTrigger
                className="cursor-pointer p-2 border"
                style={{
                  backgroundColor: color,
                }}
              >
                {title}
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => handleDeleteGrid(index, _id)}>
                  Delete
                </MenubarItem>
                <MenubarItem>Duplicate</MenubarItem>
                <MenubarSub>
                  <MenubarSubTrigger>Copy to</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>New spreadsheet</MenubarItem>
                    <MenubarItem>Existing spreadsheet</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarItem>Rename</MenubarItem>
                <MenubarItem>Change color</MenubarItem>
                <MenubarItem>Protect sheet</MenubarItem>
                <MenubarItem>View Comments</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Move right</MenubarItem>
                <MenubarItem>Move left</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          ))}
        </Menubar>
      </div>
    </div>
  );
}
