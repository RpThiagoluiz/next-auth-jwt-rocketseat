import axios from "axios";
import { parseCookies } from "nookies";

export const getApiClient = (ctx?: any) => {
  const { "nextauth-token": token } = parseCookies();

  const api = axios.create({
    baseURL: "http://localhost:3333",
  });

  //Como nao existi o backend
  api.interceptors.request.use((config) => {
    console.log(config);
    return config;
  });

  //BRABO
  if (token) {
    //Se existir ele vai enviar o token junto com a request
    api.defaults.headers["Authorization"] = `Bearer ${token}`;

    return api;
  }
};
