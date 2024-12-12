import supertest from "supertest";
import app from "../app";
import env from "../utils/env";

export const baseUrl = `http://localhost:${env.PORT}`;

export const testApp = supertest(app);

export const mockSendMail = jest.fn();
jest.mock("nodemailer", () => ({
  createTransport: () => ({
    sendMail: mockSendMail,
  }),
}));
