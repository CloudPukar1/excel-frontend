import { IAutoFillData, ICell, ICellDetail } from "@/types/Sheets";
import { RefObject } from "react";

interface IAutoFillProps {
  cells: ICell[];
  gridRef: RefObject<HTMLDivElement | null>;
  selectedCell: ICell;
  onAutoFillCell: (data: IAutoFillData) => void;
  getCellById: (cellId?: string) => ICellDetail | undefined;
  getCellIdByCoordinates: (x: number, y: number) => string | null;
}

export default function AutoFill({
  gridRef,
  cells,
  selectedCell,
  getCellById,
  onAutoFillCell,
  getCellIdByCoordinates,
}: IAutoFillProps) {
  return <div className="absolute z-10"></div>;
}
