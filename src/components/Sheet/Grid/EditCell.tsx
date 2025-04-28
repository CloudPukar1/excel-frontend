import { cn, convertToTitle } from "@/lib/utils";
import { ICell, ICellProps } from "@/types/Sheets";
import { useMemo } from "react";

interface IEditCellProps {
  cell: ICell | null;
  data?: ICellProps;
}

export default function EditCell({ cell, data }: IEditCellProps) {
  const { columnId, height, rowId, width, x, y } = cell || {};
  const { background = "#FFFFFF" } = data || "";

  const cellId = useMemo(() => {
    if (!columnId) return;
    return `${convertToTitle(columnId)}${rowId}`;
  }, [columnId]);

  return (
    <div
      className={cn(
        "absolute flex border-1 outline-3 outline-light-blue leading-5 p-[2px] z-10",
        {
          "hidden pointer-events-none": !cell,
        }
      )}
      style={{
        minWidth: width,
        minHeight: height,
        left: x,
        top: y,
      }}
    >
      <div
        id="editor"
        className="w-full text-black text-[15px] outline-2 outline-dark-blue px-[5px] leading-tight"
        style={{ background }}
      ></div>
      <div className="absolute -top-7 left-0 bg-blue text-xs font-medium text-white rounded-sm px-2 py-1">
        {cellId}
      </div>
    </div>
  );
}
