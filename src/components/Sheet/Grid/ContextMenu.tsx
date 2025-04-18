import { IRowDirection, IColumnDirection } from "@/types/Sheets";
import { Copy, ClipboardPaste, Plus, Delete } from "lucide-react";
import { MenubarSeparator } from "@/components/ui/menubar";

type IContextMenuProps = {
  onCopy: () => void;
  onPaste: () => void;
  onDeleteRow: () => void;
  onDeleteColumn: () => void;
  onInsertRow: (direction: IRowDirection) => void;
  onInsertColumn: (direction: IColumnDirection) => void;
};

export default function ContextMenu({
  onCopy,
  onPaste,
  onDeleteRow,
  onDeleteColumn,
  onInsertRow,
  onInsertColumn,
}: IContextMenuProps) {
  return (
    <div className="w-72 shadow-[0_2px_6px_2px_rgba(60,64,67,.15)] border border-transparent rounded bg-white z-50">
      <div className="flex flex-col py-3 font-medium">
        <button
          className="flex justify-between items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
          onClick={onCopy}
        >
          <span className="flex items-center gap-3">
            <Copy />
            Cut
          </span>
          <span>Ctrl + C</span>
        </button>
        <button
          className="flex justify-between items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
          onClick={onPaste}
        >
          <span className="flex items-center gap-3">
            <ClipboardPaste />
            Paste
          </span>
          <span>Ctrl + V</span>
        </button>
        <MenubarSeparator />
        <button
          className="flex justify-between items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
          onClick={() => onInsertRow("above")}
        >
          <span className="flex items-center gap-3">
            <Plus />
            Insert one row above
          </span>
        </button>
        <button
          className="flex justify-between items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
          onClick={() => onInsertRow("below")}
        >
          <span className="flex items-center gap-3">
            <Plus />
            Insert one row below
          </span>
        </button>
        <MenubarSeparator />
        <button
          className="flex justify-between items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
          onClick={() => onInsertColumn("left")}
        >
          <span className="flex items-center gap-3">
            <Plus />
            Insert one column left
          </span>
        </button>
        <button
          className="flex justify-between items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
          onClick={() => onInsertColumn("right")}
        >
          <span className="flex items-center gap-3">
            <Plus />
            Insert one column right
          </span>
        </button>
        <MenubarSeparator />
        <button
          className="flex justify-between items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
          onClick={onDeleteRow}
        >
          <span className="flex items-center gap-3">
            <Delete />
            Delete row
          </span>
        </button>
        <button
          className="flex justify-between items-center h-8 hover:bg-[#F1F3F4] text-mild-black font-medium px-3"
          onClick={onDeleteColumn}
        >
          <span className="flex items-center gap-3">
            <Delete />
            Delete column
          </span>
        </button>
      </div>
    </div>
  );
}
