import {
  IAutoFillData,
  IAutoFillDetail,
  ICell,
  ICellDetail,
} from "@/types/Sheets";
import { PointerEvent, RefObject, useRef, useState } from "react";

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
  const [pointerId, setPointerId] = useState<number | null>(null);
  const [autoFillDetail, setAutoFillDetail] = useState<IAutoFillDetail | null>(
    null
  );

  const autoFillRef = useRef<HTMLSpanElement | null>(null);

  const handlePointerDown = ({
    nativeEvent: { pointerId },
  }: PointerEvent<HTMLSpanElement>) => {
    if (!autoFillRef.current) return;
    autoFillRef.current.setPointerCapture(pointerId);
    setPointerId(pointerId);
    setAutoFillDetail({
      srcCellId: selectedCell.cellId,
      rect: {
        width: selectedCell.width,
        height: selectedCell.height,
        translateX: 0,
        translateY: 0,
      },
    });
  };

  const handleAutoFillCell = () => {
    if (
      !autoFillDetail ||
      !autoFillDetail.destCellId ||
      selectedCell.cellId === autoFillDetail.destCellId
    )
      return;
    const { translateX, translateY } = autoFillDetail.rect;
    const src = autoFillDetail.srcCellId.split(",").map((id) => +id);
    const dest = autoFillDetail.destCellId.split(",").map((id) => +id);

    const createCells: { rowId: number; columnId: number }[] = [];
    const updateCells: string[] = [];
    let rowStart, rowEnd, colStart, colEnd;

    if (translateX >= 0 && translateY >= 0) {
      rowStart = src[1];
      rowEnd = dest[1];
      colStart = src[0];
      colEnd = dest[0];
    } else if (translateX < 0 && translateY < 0) {
      rowStart = dest[1];
      rowEnd = src[1];
      colStart = dest[0];
      colEnd = src[0];
    } else if (translateX < 0 && translateY === 0) {
      rowStart = src[1];
      rowEnd = dest[1];
      colStart = dest[0];
      colEnd = src[0];
    } else if (translateX === 0 && translateY < 0) {
      rowStart = dest[1];
      rowEnd = src[1];
      colStart = src[0];
      colEnd = dest[0];
    }

    if (
      typeof rowStart !== "number" ||
      typeof rowEnd !== "number" ||
      typeof colStart !== "number" ||
      typeof colEnd !== "number"
    )
      return;

    for (let columnId = colStart; columnId <= colEnd; columnId++) {
      for (let rowId = rowStart; rowId <= rowEnd; rowId++) {
        const cellId = `${columnId},${rowId}`;
        if (cellId === selectedCell.cellId) return;
        const cellData = getCellById(cellId);
        if (cellData) updateCells.push(cellData._id);
        else createCells.push({ rowId, columnId });
      }
    }

    if (!updateCells.length && !createCells.length) return;
    const cellData = getCellById(autoFillDetail.srcCellId);
    if (!cellData) return;

    onAutoFillCell({
      updateCells,
      createCells,
      cellId: cellData._id,
    });
  };

  const handlePointerUp = () => {
    if (!autoFillRef.current || !pointerId) return;
    autoFillRef.current.releasePointerCapture(pointerId);
    handleAutoFillCell();
    setPointerId(null);
    setAutoFillDetail(null);
  };

  const handlePointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (!pointerId || !gridRef.current || !autoFillDetail) return;

    const { left, top } = gridRef.current.getBoundingClientRect();

    const pageX = event.pageX - left;
    const pageY = event.pageY - top;

    const cellId = getCellIdByCoordinates(pageX, pageY);
    if (!cellId) return;

    const cellData = cells.find((cell) => cell.cellId === cellId);

    if (!cellData) return;

    const x = pageX - selectedCell.x;
    const y = pageY - selectedCell.y;

    let width = 0;
    let height = 0;
    let translateX = 0;
    let translateY = 0;

    if (x < 0) translateX = -(selectedCell.x - cellData.x);

    if (y < 0) translateY = -(selectedCell.y - cellData.y);

    if (cellId !== selectedCell.cellId) {
      if (cellData.x > selectedCell.x)
        width = cellData.x + cellData.width - selectedCell.x;
      else width = selectedCell.x + selectedCell.width - cellData.x;

      if (cellData.y > selectedCell.y)
        height = cellData.y + cellData.height - selectedCell.y;
      else height = selectedCell.y + selectedCell.height - cellData.y;
    } else {
      width = selectedCell.width;
      height = selectedCell.height;
    }

    setAutoFillDetail({
      ...autoFillDetail,
      destCellId: cellId,
      rect: {
        width,
        height,
        translateX,
        translateY,
      },
    });
  };

  return (
    <div className="absolute z-10">
      <span
        ref={autoFillRef}
        className="absolute -translate-x-[6px] -translate-y-[6px] border border-white bg-dark-blue w-3 h-3 rounded-full cursor-crosshair"
        style={{
          left: `calc(${
            selectedCell.x + selectedCell.width
          }px - var(--col-width))`,
          top: `calc(${
            selectedCell.y + selectedCell.height
          }px - var(--row-height))`,
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      ></span>
      {autoFillDetail && (
        <div
          className="absolute border border-dashed border-black"
          style={{
            ...autoFillDetail.rect,
            width: autoFillDetail.rect.width,
            height: autoFillDetail.rect.height,
            transform: `translate(${autoFillDetail.rect.translateX}px,${autoFillDetail.rect.translateY}px)`,
            left: `calc(${selectedCell.x}px - var(--col-width))`,
            top: `calc(${selectedCell.y}px - var(--row-height))`,
          }}
        ></div>
      )}
    </div>
  );
}
