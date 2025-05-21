export type IRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type IRow = {
  rowId: number;
} & IRect;

export type IColumn = {
  columnId: number;
} & IRect;

export type ICell = {
  cellId: string;
  rowId: number;
  columnId: number;
} & IRect;

export type ISheetGrid = {
  _id: string;
  title: string;
  color: string;
  sheetId: string;
};

export type ISheetDetail = {
  _id: string;
  title: string;
  grids: ISheetGrid[];
};

export type ISheetList = {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt: string;
}[];

export type IRowDirection = "above" | "below";
export type IColumnDirection = "left" | "right";

export type IColumnDetail = { _id: string; columnId: number; width: number };
export type IRowDetail = { _id: string; rowId: number; height: number };
export type ICellDetail = ICellProps & Pick<ICell, "rowId" | "columnId">;

export type IGrid = {
  rows: IRow[];
  columns: IColumn[];
  cells: ICell[];
};

export type ICellProps = {
  _id: string;
  text?: string;
  content?: any[];
  background?: string;
};

export type IAutoFillData = {
  createCells: { rowId: number; columnId: number }[];
  updateCells: string[];
  cellId: string;
};

export type IAutoFillDetail = {
  srcCellId: string;
  destCellId?: string;
  rect: {
    width: number;
    height: number;
    translateX: number;
    translateY: number;
  };
};

export interface IConfig {
  lineWidth: number;
  strokeStyle: string;
  cellHeight: number;
  cellWidth: number;
  colWidth: number;
  defaultFont: string;
  defaultFontSize: string;
  scrollBarSize: number;
  scrollThumbSize: number;
  rowHeight: number;
  customFonts: string[];
  fonts: Record<string, string>;
  scale: number[];
  fontSizes: string[];
}

export type IRenderGrid = (data: {
  rowStart: number;
  colStart: number;
  offsetX?: number;
  offsetY?: number;
}) => void;
