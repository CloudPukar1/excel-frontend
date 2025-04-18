import api from "./api";

export const createGrid = (sheetId: string) => {
  return api.post("/grid", { sheetId });
};

export const removeGridById = (gridId: string) => {
  return api.delete(`/grid/${gridId}`);
};
