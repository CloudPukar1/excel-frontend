import { ILogin, IRegister } from "@/types/User";
import api from "./api";

export const loginUser = (data: ILogin) => {
  return api.post("/auth/login", data);
};

export const registerUser = (data: IRegister) => {
  return api.post("/user", data);
};
