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
