import { IColumn } from "@/types/Sheets";

interface IColumnOverlayProps {
  column: IColumn;
}

export default function ColumnOverlay({
  column: { width, x },
}: IColumnOverlayProps) {
  const left = `calc(${x}px - var(--col-width))`;

  return (
    <div
      className="absolute top-[var(--col-height)] left-0 w-[var(--col-width)] border-dark-blue border-r border-l bg-light-sky-blue h-full"
      style={{ width, left }}
    ></div>
  );
}
