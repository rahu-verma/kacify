import { Router } from "express";
import PermissionModel from "../models/permission";
import { PermissionAddRequestBody } from "../utils/validations";
import {
  authVerification,
  permissionVerification,
  userVerification,
} from "../middlewares/auth";
import { requestBodyValidation } from "../middlewares/validation";
import { RequestBodyValidatedUserRequest } from "../utils/types";
import { z } from "zod";

const PermissionRouter = Router();

PermissionRouter.get(
  "/add",
  authVerification,
  userVerification("superuser"),
  permissionVerification(["addPermission"]),
  requestBodyValidation(PermissionAddRequestBody),
  async (
    req: RequestBodyValidatedUserRequest<
      z.infer<typeof PermissionAddRequestBody>
    >,
    res,
    next
  ) => {
    try {
      const { name } = req.body;

      await PermissionModel.create({ name });

      res.json({
        success: true,
        message: "permission added successfully",
        code: "permissionAdded",
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }
);

export default PermissionRouter;
