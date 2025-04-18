import { createGrid, removeGridById } from "@/services/Grid";
import { deleteColumn, deleteRow } from "@/services/Cell";
import { getSheetById, updateSheetById } from "@/services/Sheet";
import { IGrid, ISheetDetail } from "@/types/Sheets";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type ISheetContext = {
  isSheetLoading: boolean;
  sheetDetail: ISheetDetail | null;
  handleCreateGrid: () => void;
  handleDeleteGrid: (index: number, gridId: string) => void;
  handlePasteCell: () => void;
  handleCopyCell: () => void;
  handleDeleteRow: () => void;
  handleInsertRow: () => void;
  handleDeleteColumn: () => void;
  handleInsertColumn: () => void;
  handleTitleChange: (title: string) => void;
};

const SheetContext = createContext({} as ISheetContext);

export default function SheetProvider({ children }: PropsWithChildren) {
  const { sheetId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const gridId = searchParams.get("gridId");

  const [isSheetLoading, setIsSheetLoading] = useState(true);
  const [selectedCellId, setSelectedCellId] = useState<number | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
  const [sheetDetail, setSheetDetail] = useState<ISheetDetail | null>(null);

  const [grid] = useState<IGrid>({
    cells: [],
    columns: [],
    rows: [],
  });

  const selectedCell = useMemo(() => {
    const cell = grid.cells.find(({ cellId }) => cellId === selectedCellId);
    return cell || null;
  }, [selectedCellId]);

  const selectedRow = useMemo(() => {
    const row = grid.rows.find(({ rowId }) => rowId === selectedRowId);
    return row || null;
  }, [selectedRowId]);

  const selectedColumn = useMemo(() => {
    const column = grid.columns.find(
      ({ columnId }) => columnId === selectedColumnId
    );
    return column || null;
  }, [selectedColumnId]);

  const handleTitleChange = async (title: string) => {
    if (!sheetId) {
      return;
    }

    try {
      await updateSheetById(sheetId, { title });
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const getSheetDetails = async () => {
    if (!sheetId) return;

    setIsSheetLoading(true);
    try {
      const {
        data: {
          data: { _id, grids, title },
        },
      } = await getSheetById(sheetId);
      setSheetDetail({
        _id,
        grids,
        title,
      });
      if (!gridId) {
        navigate(
          { search: `gridId=${grids[0]._id}` },
          { replace: !sheetDetail }
        );
      }

      setIsSheetLoading(false);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleCreateGrid: ISheetContext["handleCreateGrid"] = async () => {
    if (!sheetDetail) return;

    try {
      const {
        data: { data },
      } = await createGrid(sheetDetail._id);
      const sheetData = { ...sheetDetail };
      sheetData.grids.push(data);
      setSheetDetail(sheetData);
      navigate({ search: `gridId=${data._id}` });
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleDeleteGrid: ISheetContext["handleDeleteGrid"] = async (
    index,
    gridId
  ) => {
    if (!sheetDetail || !window.confirm("Are you sure to delete the grid?"))
      return;

    try {
      await removeGridById(gridId);
      const sheetData = { ...sheetDetail };
      sheetData.grids.splice(index, 1);
      setSheetDetail(sheetData);
      navigate({
        search:
          sheetData.grids.length === 0
            ? "/sheet/list"
            : `gridId=${sheetData.grids[sheetData.grids.length - 1]._id}`,
      });
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handlePasteCell: ISheetContext["handlePasteCell"] = async () => {};
  const handleCopyCell: ISheetContext["handleCopyCell"] = async () => {};
  const handleDeleteRow: ISheetContext["handleDeleteRow"] = async () => {
    if (!gridId || !window.confirm("Are you sure to delete the row?")) return;
    const rowId = selectedCell?.rowId || selectedRow?.rowId;

    if (!rowId) return;
    try {
      await deleteRow(gridId, rowId);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };
  const handleInsertRow: ISheetContext["handleInsertRow"] = async () => {};
  const handleDeleteColumn: ISheetContext["handleDeleteColumn"] = async () => {
    if (!gridId || !window.confirm("Are you sure to delete the column?"))
      return;

    const columnId = selectedCell?.columnId || selectedColumn?.columnId;

    if (!columnId) return;

    try {
      await deleteColumn(gridId, columnId);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };
  const handleInsertColumn: ISheetContext["handleInsertColumn"] =
    async () => {};

  useEffect(() => {
    getSheetDetails();
  }, []);

  return (
    <SheetContext.Provider
      value={{
        sheetDetail,
        isSheetLoading,
        handlePasteCell,
        handleCopyCell,
        handleDeleteRow,
        handleInsertRow,
        handleDeleteColumn,
        handleInsertColumn,
        handleCreateGrid,
        handleDeleteGrid,
        handleTitleChange,
      }}
    >
      {children}
    </SheetContext.Provider>
  );
}

export const useSheet = () => {
  return useContext(SheetContext);
};
