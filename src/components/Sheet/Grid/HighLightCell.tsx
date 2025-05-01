import { cn } from "@/lib/utils";
import { ICell } from "@/types/Sheets";

interface IHighLightCellProps {
  cell: ICell;
  dashed?: boolean;
}

export default function HightLightCell({
  cell,
  dashed = false,
}: IHighLightCellProps) {
  return (
    <div className={cn("absolute", dashed ? "z-20" : "z-10")}>
      <div
        className={cn(
          "absolute border-t-2 border-blue",
          dashed && "border-dashed"
        )}
        style={{
          width: cell.width,
          left: `calc(${cell.x}px - var(--col-width))`,
          top: `calc(${cell.y}px - var(--row-height))`,
        }}
      ></div>
      <div
        className={cn(
          "absolute border-b-2 border-blue",
          dashed && "border-dashed"
        )}
        style={{
          width: cell.width,
          left: `calc(${cell.x}px - var(--col-width))`,
          top: `calc(${cell.y + cell.height}px - var(--row-height))`,
        }}
      ></div>
      <div
        className={cn(
          "absolute border-l-2 border-blue",
          dashed && "border-dashed"
        )}
        style={{
          height: cell.height,
          left: `calc(${cell.x}px - var(--col-width))`,
          top: `calc(${cell.y}px - var(--row-height))`,
        }}
      ></div>
      <div
        className={cn(
          "absolute border-r-2 border-blue",
          dashed && "border-dashed"
        )}
        style={{
          height: cell.height,
          left: `calc(${cell.x + cell.width}px - var(--col-width))`,
          top: `calc(${cell.y}px - var(--row-height))`,
        }}
      ></div>
    </div>
  );
}
