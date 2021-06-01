import { getApiClient } from "./axios";

//Vou utulizar somente quando for utilizada no browser, q ela nao vai precisar ter um contexto.

export const api = getApiClient();
