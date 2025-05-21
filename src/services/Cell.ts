import { IAutoFillData } from "@/types/Sheets";
import api from "./api";

export const deleteRow = (gridId: string, rowId: number) => {
  return api.delete(`/cell/${gridId}/${rowId}/row`);
};

export const deleteColumn = (gridId: string, columnId: number) => {
  return api.delete(`/cell/${gridId}/${columnId}/row`);
};

export const duplicateCells = (gridId: string, data: IAutoFillData) => {
  return api.post(`/cell/${gridId}/duplicate`, data);
};
