import api from "./api";

import { buildQueryParams } from "@/lib/utils";

export const getSheetList = (params: {
  limit: number;
  search: string;
  page: number;
}) => {
  return api.get(`/sheet${buildQueryParams(params)}`);
};

export const removeSheetById = (sheetId: string) => {
  return api.delete(`/sheet/${sheetId}`);
};

export const createSheet = () => {
  return api.post(`/sheet`)
}