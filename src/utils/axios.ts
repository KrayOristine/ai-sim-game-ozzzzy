import axios, { AxiosResponse } from "axios";

// wrapper
export class Request {
  constructor() {
    throw new Error("Illegal constructor!");
  }

  static getJSON<Res>(url: string) {
    return axios<any, AxiosResponse<Res>>({
      method: "GET",
      url: url,
      responseType: "json",
      responseEncoding: "UTF8",
    });
  }
}
