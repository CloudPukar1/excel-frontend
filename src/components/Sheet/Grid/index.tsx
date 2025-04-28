import { useSheet } from "@/hooks/useSheet";
import ContextMenu from "./ContextMenu";
import EditCell from "./EditCell";

export default function Grid() {
  const {
    editCell,
    handleCopyCell,
    handlePasteCell,
    handleDeleteRow,
    handleDeleteColumn,
    handleInsertRow,
    handleInsertColumn,
  } = useSheet();

  return (
    <>
      {editCell && <EditCell />}
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
