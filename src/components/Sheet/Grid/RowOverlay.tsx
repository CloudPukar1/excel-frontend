import { IRow } from "@/types/Sheets";

interface IRowOverlayProps {
  column: IRow;
}

export default function RowOverlay({
  column: { height, x },
}: IRowOverlayProps) {
  const top = `calc(${x}px - var(--col-width))`;

  return (
    <div
      className="absolute top-[var(--col-height)] left-0 w-full border-dark-blue border-t border-b bg-light-sky-blue"
      style={{ height, top }}
    ></div>
  );
}
