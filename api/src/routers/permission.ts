import { Router } from "express";
import PermissionModel from "../models/permission";
import { PermissionAddRequestBody } from "../utils/validations";
import {
  authVerification,
  permissionVerification,
  userVerification,
} from "../middlewares/auth";

const PermissionRouter = Router();

PermissionRouter.get(
  "/add",
  authVerification,
  userVerification("superuser"),
  permissionVerification(["addPermission"]),
  async (req, res, next) => {
    try {
      const results = PermissionAddRequestBody.safeParse(req.body);
      if (!results.success) {
        res.status(400).json({
          success: false,
          message: "validation failed",
          data: results.error.format(),
          code: "validationFailed",
        });
        return;
      }

      const { name } = results.data;
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
