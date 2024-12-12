import { ZodSchema } from "zod";
import { errorCatcher } from "./error";
import { response200, response500 } from "../utils/request";

export const serializeHandler = (zodSchema: ZodSchema) => {
  return errorCatcher(async (req, res, next) => {
    const parsedData = zodSchema.safeParse(req.data ?? {});
    if (!parsedData.success) {
      response500(res);
      return;
    }
    response200(res, {
      message: req.responseMessage ?? "success",
      data: parsedData.data,
    });
    return;
  });
};
