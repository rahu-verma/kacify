import { Router } from "express";
import PermissionModel from "../models/permission";
import { PermissionAddRequestBody } from "../utils/zod";
import {
  authVerification,
  permissionVerification,
  userVerification,
} from "../middlewares/auth";
import { requestBodyValidation } from "../middlewares/validation";
import { RequestBodyValidatedUserRequest } from "../utils/types";
import { z } from "zod";
import { errorCatcher } from "../middlewares/error";

const PermissionRouter = Router();

PermissionRouter.get(
  "/add",
  authVerification,
  userVerification("superuser"),
  permissionVerification(["addPermission"]),
  requestBodyValidation(PermissionAddRequestBody),
  errorCatcher(
    async (
      req: RequestBodyValidatedUserRequest<
        z.infer<typeof PermissionAddRequestBody>
      >,
      res,
      next
    ) => {
      const { name } = req.body;

      await PermissionModel.create({ name });

      res.json({
        success: true,
        message: "permission added successfully",
        code: "permissionAdded",
        data: {},
      });
    }
  )
);

export default PermissionRouter;
