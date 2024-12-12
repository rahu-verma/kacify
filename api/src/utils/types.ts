import { Request } from "express";

export interface RequestBodyValidatedRequest<BodyType> extends Request {
  body: BodyType;
}
