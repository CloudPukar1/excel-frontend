import { convertToTitle } from "@/lib/utils";
import { IColumn } from "@/types/Sheets";
import { useMemo } from "react";

interface IHighLightColumnProps {
  scale: number;
  column: IColumn;
}

export default function HighLightColumn({
  scale,
  column: { columnId, height, width, x, y },
}: IHighLightColumnProps) {
  const left = `calc(${x}px - var(--col-width))`;

  const title = useMemo(() => convertToTitle(columnId), [columnId]);

  return (
    <div className="absolute left-[var(--col-width)] top-0 w-[calc(100%-var(--col-width))] h-[var(--row-height)] overflow-hidden z-10">
      <div
        className="absolute flex justify-center items-center bg-dark-blue"
        style={{ left, top: y, width, height }}
      >
        <span
          className="text-white font-medium"
          style={{
            fontSize: `${12 * scale}px`,
          }}
        >
          {title}
        </span>
      </div>
    </div>
  );
}
