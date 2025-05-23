import { createGrid, getGridById, removeGridById } from "@/services/Grid";
import { deleteColumn, deleteRow, duplicateCells } from "@/services/Cell";
import { getSheetById, updateSheetById } from "@/services/Sheet";
import {
  IAutoFillData,
  ICell,
  ICellDetail,
  IColumn,
  IColumnDetail,
  IGrid,
  IRect,
  IRow,
  IRowDetail,
  ISheetDetail,
} from "@/types/Sheets";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type ISheetContext = {
  scale: number;
  grid: IGrid;
  copiedCell: ICell | null;
  editCell: ICell | null;
  isSheetLoading: boolean;
  isGridLoading: boolean;
  sheetDetail: ISheetDetail | null;
  contextMenuRect: Pick<IRect, "x" | "y"> | null;
  selectedCell: ICell | null;
  selectedRow: IRow | null;
  selectedColumn: IColumn | null;
  setCopyCellId: Dispatch<SetStateAction<string | null>>;
  setSelectedCellId: Dispatch<SetStateAction<string | null>>;
  getCellById: (cellId?: string) => ICellDetail | undefined;
  getRowById: (rowId?: number) => IRowDetail | undefined;
  getColumnById: (columnId?: number) => IColumnDetail | undefined;
  handleCreateGrid: () => void;
  handleDeleteGrid: (index: number, gridId: string) => void;
  handlePasteCell: () => void;
  handleCopyCell: () => void;
  handleDeleteRow: () => void;
  handleInsertRow: () => void;
  handleAutoFillCell: (data: IAutoFillData) => void;
  handleDeleteColumn: () => void;
  handleInsertColumn: () => void;
  handleTitleChange: (title: string) => void;
  setGrid: Dispatch<SetStateAction<IGrid>>;
  setEditCell: Dispatch<SetStateAction<ICell | null>>;
  setContextMenuRect: Dispatch<SetStateAction<Pick<IRect, "x" | "y"> | null>>;
  setSelectedColumnId: Dispatch<SetStateAction<number | null>>;
  setSelectedRowId: Dispatch<SetStateAction<number | null>>;
};

const SheetContext = createContext({} as ISheetContext);

export default function SheetProvider({ children }: PropsWithChildren) {
  const { sheetId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const gridId = searchParams.get("gridId");

  const [syncState, setSyncState] = useState(0);
  const [isSheetLoading, setIsSheetLoading] = useState(true);
  const [isGridLoading, setIsGridLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [contextMenuRect, setContextMenuRect] =
    useState<ISheetContext["contextMenuRect"]>(null);
  const [activeHighLightIndex, setActiveHighLightIndex] = useState<
    number | null
  >(null);
  const [highLightCells, setHighLightCells] = useState<string[]>([]);
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
  const [editCell, setEditCell] = useState<ICell | null>(null);
  const [sheetDetail, setSheetDetail] = useState<ISheetDetail | null>(null);

  const [grid, setGrid] = useState<IGrid>({
    cells: [],
    columns: [],
    rows: [],
  });
  const [copyCellId, setCopyCellId] = useState<string | null>(null);

  const rowDetails = useRef<Map<string, IRowDetail>>(new Map());
  const columnDetails = useRef<Map<string, IColumnDetail>>(new Map());
  const cellDetails = useRef<Map<string, ICellDetail>>(new Map());
  const cellIds = useRef<Map<string, string>>(new Map());
  const columnIds = useRef<Map<number, string>>(new Map());
  const rowIds = useRef<Map<number, string>>(new Map());

  const selectedCell = useMemo(() => {
    const cell = grid.cells.find(({ cellId }) => cellId === selectedCellId);
    return cell || null;
  }, [selectedCellId]);

  const copiedCell = useMemo(() => {
    const cell = grid.cells.find(({ cellId }) => cellId === copyCellId);
    return cell || null;
  }, [grid.cells, copyCellId]);

  const selectedRow = useMemo(() => {
    const row = grid.rows.find(({ rowId }) => rowId === selectedRowId);
    return row || null;
  }, [grid.cells, selectedRowId]);

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

  const resetGrid = () => {
    setIsGridLoading(true);
    setEditCell(null);
    setContextMenuRect(null);
    setSelectedCellId(null);
    setSelectedColumnId(null);
    setSelectedRowId(null);
    setActiveHighLightIndex(null);
    setHighLightCells([]);
    setGrid({ cells: [], columns: [], rows: [] });
  };

  const getGridDetails = async () => {
    if (!gridId) return;

    resetGrid();

    try {
      const {} = await getGridById(gridId);
      setGrid;
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const setCellById = (cell: ICellDetail) => {
    const cellId = `${cell.columnId}, ${cell.rowId}`;
    cellIds.current.set(cellId, cell._id);
    cellDetails.current.set(cell._id, cell);
  };

  const setCellDetails = (cells: ICellDetail[]) => {
    for (let cell of cells) {
      setCellById(cell);
    }
  };

  const getCellById: ISheetContext["getCellById"] = (cellId) => {
    if (typeof cellId !== "string") return;
    if (cellDetails.current.has(cellId)) return cellDetails.current.get(cellId);
    const id = cellIds.current.get(cellId);
    if (!id) return;
    return cellDetails.current.get(id);
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

  const getRowById: ISheetContext["getRowById"] = (rowId) => {
    if (typeof rowId !== "number") return;
    const id = rowIds.current.get(rowId);
    if (!id) return;
    return rowDetails.current.get(id);
  };

  const getColumnById: ISheetContext["getColumnById"] = (columnId) => {
    if (typeof columnId !== "number") return;
    const id = columnIds.current.get(columnId);
    if (!id) return;
    return columnDetails.current.get(id);
  };

  const forceUpdate = () => {
    setSyncState(Math.random() + 1);
  };

  const handleAutoFillCell: ISheetContext["handleAutoFillCell"] = async (
    data
  ) => {
    if (!gridId) return;

    try {
      const {
        data: {
          data: { cells },
        },
      } = await duplicateCells(gridId, data);
      setCellDetails(cells);
      forceUpdate();
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleInsertColumn: ISheetContext["handleInsertColumn"] =
    async () => {};

  useEffect(() => {
    getSheetDetails();
  }, [sheetId]);

  useEffect(() => {
    getGridDetails();
  }, [gridId]);

  return (
    <SheetContext.Provider
      value={{
        setCopyCellId,
        scale,
        grid,
        setGrid,
        getRowById,
        selectedCell,
        contextMenuRect,
        setContextMenuRect,
        editCell,
        copiedCell,
        setEditCell,
        getColumnById,
        setSelectedCellId,
        selectedRow,
        selectedColumn,
        sheetDetail,
        isGridLoading,
        isSheetLoading,
        getCellById,
        handlePasteCell,
        handleCopyCell,
        handleDeleteRow,
        handleInsertRow,
        handleDeleteColumn,
        handleInsertColumn,
        handleCreateGrid,
        handleDeleteGrid,
        handleTitleChange,
        handleAutoFillCell,
        setSelectedRowId,
        setSelectedColumnId,
      }}
    >
      {children}
    </SheetContext.Provider>
  );
}

export const useSheet = () => {
  return useContext(SheetContext);
};
