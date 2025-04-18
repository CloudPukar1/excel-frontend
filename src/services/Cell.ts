import api from "./api";

export const deleteRow = (gridId: string, rowId: number) => {
  return api.delete(`/cell/${gridId}/${rowId}/row`);
};

export const deleteColumn = (gridId: string, columnId: number) => {
  return api.delete(`/cell/${gridId}/${columnId}/row`);
};
