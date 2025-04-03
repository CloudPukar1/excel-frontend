import axios from "axios";

import { cookie } from "@/lib/utils";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

api.interceptors.request.use(
  (config) => {
    let token = cookie.get("auth_token");
    if (token) {
      config.headers["authorization"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
