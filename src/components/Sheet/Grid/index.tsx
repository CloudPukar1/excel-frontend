import { useSheet } from "@/hooks/useSheet";
import ContextMenu from "./ContextMenu";
import EditCell from "./EditCell";
import Loader from "@/components/Loader";
import HighLightColumn from "./HIghLightColumn";
import HighLightRow from "./HighLightRow";
import HightLightCell from "./HighLightCell";

export default function Grid() {
  const {
    scale,
    editCell,
    copiedCell,
    selectedCell,
    selectedColumn,
    selectedRow,
    isGridLoading,
    getCellById,
    handleCopyCell,
    handlePasteCell,
    handleDeleteRow,
    handleDeleteColumn,
    handleInsertRow,
    handleInsertColumn,
  } = useSheet();

  return (
    <>
      <div className="relative w-[var(--grid-width)] h-[var(--grid-height)] select-none overflow-hidden">
        {isGridLoading && <Loader />}
        <canvas></canvas>
        {selectedColumn && (
          <HighLightColumn scale={scale} column={selectedColumn} />
        )}
        {selectedRow && <HighLightRow scale={scale} row={selectedRow} />}
      </div>
      {editCell && (
        <EditCell cell={editCell} data={getCellById(editCell?.cellId)} />
      )}
      <div className="absolute left-[var(--col-width)] top-[var(--row-height)] w-[calc(100%-var(--col-width))] h-[calc(100%-var(--row-height))] overflow-hidden">
        {copiedCell && <HightLightCell cell={copiedCell} dashed />}
        {selectedCell && !editCell && selectedCell !== copiedCell && (
          <>
            <HightLightCell cell={selectedCell} />
            <AutoFill cells={cells} />
          </>
        )}
      </div>
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
