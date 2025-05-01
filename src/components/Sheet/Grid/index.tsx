import { useSheet } from "@/hooks/useSheet";
import ContextMenu from "./ContextMenu";
import EditCell from "./EditCell";

export default function Grid() {
  const {
    editCell,
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
