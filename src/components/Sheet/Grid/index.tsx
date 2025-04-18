import { useSheet } from "@/hooks/useSheet";
import ContextMenu from "./ContextMenu";

export default function Grid() {
  const {
    handleCopyCell,
    handlePasteCell,
    handleDeleteRow,
    handleDeleteColumn,
    handleInsertRow,
    handleInsertColumn,
  } = useSheet();

  return (
    <ContextMenu
      onCopy={handleCopyCell}
      onPaste={handlePasteCell}
      onDeleteRow={handleDeleteRow}
      onDeleteColumn={handleDeleteColumn}
      onInsertRow={handleInsertRow}
      onInsertColumn={handleInsertColumn}
    />
  );
}
