type IRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type IRow = {
  rowId: number;
} & IRect;

type IColumn = {
  columnId: number;
} & IRect;

type ICell = {
  cellId: number;
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

export type IGrid = {
  rows: IRow[];
  columns: IColumn[];
  cells: ICell[];
};
