import supertest from "supertest";
import app from "../../app";
import axios from "axios";
import { baseUrl } from "../setupFile";

describe("/", () => {
  it("valid request", async () => {
    // const response = await supertest(app).get("/product/");
    // console.log(response.body);
    // expect(response.status).toBe(200);
  });
  it("externally", async () => {
    axios.get(`${baseUrl}/product/`).catch((error) => {
      console.log(error.response.data);
    });
  });
});
