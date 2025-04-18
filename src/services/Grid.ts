import api from "./api";

export const createGrid = (sheetId: string) => {
  return api.post(`/grid`, { sheetId });
};
