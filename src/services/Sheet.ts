import api from "./api";

import { buildQueryParams } from "@/lib/utils";

export const getSheetList = (params: {
  limit: number;
  search: string;
  page: number;
}) => {
  return api.get(`/sheet${buildQueryParams(params)}`);
};
