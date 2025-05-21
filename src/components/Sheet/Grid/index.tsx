import { useSheet } from "@/hooks/useSheet";
import ContextMenu from "./ContextMenu";
import EditCell from "./EditCell";
import Loader from "@/components/Loader";
import HighLightColumn from "./HighLightColumn";
import HighLightRow from "./HighLightRow";
import HightLightCell from "./HighLightCell";
import AutoFill from "./AutoFill";
import { MouseEvent, useRef, WheelEvent } from "react";
import { config } from "@/lib/constants";
import { ICell, IColumn, IRenderGrid, IRow } from "@/types/Sheets";
import ColumnOverlay from "./ColumnOverlay";
import RowOverlay from "./RowOverlay";

export default function Grid() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const verticalScrollRef = useRef<HTMLDivElement | null>(null);
  const horizontalScrollRef = useRef<HTMLDivElement | null>(null);

  const {
    grid,
    scale,
    editCell,
    setGrid,
    copiedCell,
    selectedCell,
    selectedColumn,
    selectedRow,
    isGridLoading,
    setCopyCellId,
    getCellById,
    getRowById,
    getColumnById,
    handleCopyCell,
    handlePasteCell,
    handleDeleteRow,
    setSelectedCellId,
    setEditCell,
    setSelectedColumnId,
    setContextMenuRect,
    setSelectedRowId,
    handleDeleteColumn,
    handleInsertRow,
    handleAutoFillCell,
    handleInsertColumn,
  } = useSheet();

  const { rows, columns, cells } = grid;

  const getCellIdByCoodinates = (x: number, y: number) => {
    const { rows, columns } = grid;
    let left = 0;
    let right = rows.length - 1;
    let rowId = null;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (rows[mid].y <= y) {
        left = mid + 1;
        rowId = rows[mid].rowId;
      } else {
        right = mid - 1;
      }
    }

    if (!rowId) return null;

    left = 0;
    right = columns.length - 1;
    let columnId = null;

    while (left <= right) {
      let mid = Math.floor((left + right) / 2);

      if (columns[mid].x <= x) {
        left = mid + 1;
        columnId = columns[mid].columnId;
      } else {
        right = mid - 1;
      }
    }

    if (!columnId) return null;
    return `${columnId},${rowId}`;
  };

  const renderGrid: IRenderGrid = ({
    offsetX = config.colWidth * scale,
    offsetY = config.rowHeight * scale,
    rowStart = 1,
    colStart = 1,
  }) => {
    if (!canvasRef.current) return;

    const { width, height } = canvasRef.current;

    const rowData: IRow[] = [];
    const columnData: IColumn[] = [];
    const cellData: ICell[] = [];

    for (let i = rowStart, y = offsetY; y < height; i++) {
      const height = (getRowById(i)?.height || config.cellHeight) * scale;

      if (y + height > config.rowHeight * scale) {
        rowData.push({
          y,
          x: 0,
          rowId: i,
          height,
          width: config.colWidth * scale,
        });
      }

      y += height;
    }

    for (let i = colStart, x = offsetX; x < width; i++) {
      const width = (getColumnById(i)?.width || config.cellWidth) * scale;

      if (x + height > config.rowHeight * scale) {
        columnData.push({
          x,
          y: 0,
          columnId: i,
          width,
          height: config.rowHeight * scale,
        });
      }

      x += width;
    }

    for (let { rowId, height, y } of rowData) {
      for (let { width, x, columnId } of columnData) {
        const cellId = `${columnId}, ${rowId}`;

        cellData.push({
          x,
          y,
          rowId,
          columnId,
          width,
          height,
          cellId,
        });
      }
    }

    setGrid({
      cells: cellData,
      columns: columnData,
      rows: rowData,
    });
  };

  const handleVerticalScroll = (deltaY: number) => {
    if (!gridRef.current || !rows.length || !columns.length) return;

    let { rowId, y } = rows[0];
    let { columnId, x } = columns[0];

    if (deltaY < 0) {
      // Scroll upward
      y += -deltaY;
      rowId--;

      while (rowId > 0 && y > config.rowHeight * scale) {
        y -= (getRowById(rowId)?.height || config.cellHeight) * scale;
        rowId--;
      }

      const offsetY = Math.min(config.rowHeight * scale, y);

      renderGrid({
        offsetX: x,
        offsetY,
        rowStart: rowId + 1,
        colStart: columnId,
      });
    } else {
      // scroll downwards
      renderGrid({
        offsetX: x,
        offsetY: y + -deltaY,
        rowStart: rowId,
        colStart: columnId,
      });
    }
  };

  const handleHorizontalScroll = (deltaX: number) => {
    if (!gridRef.current || !rows.length || !columns.length) return;

    let { rowId, y } = rows[0];
    let { columnId, x } = columns[0];

    if (deltaX < 0) {
      // Scroll leftwards
      x += -deltaX;
      columnId--;

      while (columnId > 0 && x > config.colWidth * scale) {
        x -= (getColumnById(columnId)?.width || config.cellHeight) * scale;
        rowId--;
      }

      renderGrid({
        offsetX: Math.min(config.colWidth * scale, x),
        offsetY: y,
        rowStart: rowId,
        colStart: columnId + 1,
      });
    } else {
      // scroll downwards
      renderGrid({
        offsetX: x + -deltaX,
        offsetY: y,
        rowStart: rowId,
        colStart: columnId,
      });
    }
  };

  const handleScroll = (event: WheelEvent) => {
    const { deltaX, deltaY } = event;

    if (deltaX === 0) handleVerticalScroll(deltaY);
    else handleHorizontalScroll(deltaX);
  };

  const handleClickGrid = (event: MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;

    const { left, top } = gridRef.current.getBoundingClientRect();

    const x = event.pageX - left;
    const y = event.pageY - top;

    const cellId = getCellIdByCoodinates(x, y);

    if (!cellId) return;

    setSelectedCellId(cellId);
    setEditCell(null);
    setSelectedColumnId(null);
    setSelectedRowId(null);
    setContextMenuRect(null);
  };

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleClickGrid(event);
    setContextMenuRect({ x: event.pageX, y: event.pageY });
  };

  const handleDoubleClickGrid = () => {
    if (!gridRef.current || !selectedCell) return;

    const { columnId, cellId, width, height, rowId, x, y } = selectedCell;

    const { top } = gridRef.current.getBoundingClientRect();

    setSelectedCellId(null);
    setCopyCellId(null);
    setEditCell({
      cellId,
      columnId,
      width,
      height,
      rowId,
      x: Math.max(config.colWidth, x),
      y: Math.max(config.rowHeight + top, y + top),
    });
  };

  return (
    <>
      <div
        ref={gridRef}
        className="relative w-[var(--grid-width)] h-[var(--grid-height)] select-none overflow-hidden"
        onWheel={handleScroll}
        onMouseDown={handleClickGrid}
        onContextMenu={handleContextMenu}
        onDoubleClick={handleDoubleClickGrid}
      >
        {isGridLoading && <Loader />}
        <canvas ref={canvasRef}></canvas>
        {selectedColumn && (
          <HighLightColumn scale={scale} column={selectedColumn} />
        )}
        {selectedRow && <HighLightRow scale={scale} row={selectedRow} />}
      </div>
      <div className="absolute left-[var(--col-width)] top-[var(--row-height)] w-[calc(100%-var(--col-width))] h-[calc(100%-var(--row-height))] overflow-hidden">
        {copiedCell && <HightLightCell cell={copiedCell} dashed />}
        {selectedCell && !editCell && selectedCell !== copiedCell && (
          <>
            <HightLightCell cell={selectedCell} />
            <AutoFill
              cells={cells}
              gridRef={gridRef}
              selectedCell={selectedCell}
              getCellById={getCellById}
              onAutoFillCell={handleAutoFillCell}
              getCellIdByCoordinates={getCellIdByCoodinates}
            />
          </>
        )}
        {selectedColumn && <ColumnOverlay column={selectedColumn} />}
        {selectedRow && <RowOverlay row={selectedRow} />}
        {!!highLightCells.length && activeHighLightIndex !== null && (
          <HighLightSearchCells cells={cells} hgith />
        )}
      </div>
      {editCell && (
        <EditCell cell={editCell} data={getCellById(editCell?.cellId)} />
      )}
      <ContextMenu
        onCopy={handleCopyCell}
        onPaste={handlePasteCell}
        onDeleteRow={handleDeleteRow}
        onDeleteColumn={handleDeleteColumn}
        onInsertRow={handleInsertRow}
        onInsertColumn={handleInsertColumn}
      />
    </>
  );
}
