import { Router } from "express";
import { z } from "zod";
import {
  authVerification,
  permissionVerification,
  userVerification,
} from "../middlewares/auth";
import { errorCatcher } from "../middlewares/error";
import { serializeHandler } from "../middlewares/serializer";
import { requestBodyValidation } from "../middlewares/validation";
import PermissionModel from "../models/permission";
import { RequestBodyValidatedRequest } from "../utils/types";
import { EmptyResponseDataSchema, PermissionAddRequestBody } from "../utils/zod";

const PermissionRouter = Router();

PermissionRouter.get(
  "/add",
  authVerification,
  userVerification("superuser"),
  permissionVerification(["addPermission"]),
  requestBodyValidation(PermissionAddRequestBody),
  errorCatcher(
    async (
      req: RequestBodyValidatedRequest<
        z.infer<typeof PermissionAddRequestBody>
      >,
      res,
      next
    ) => {
      const { name } = req.body;
      await PermissionModel.create({ name });
      next();
    }
  ),
  serializeHandler(EmptyResponseDataSchema)
);

export default PermissionRouter;
