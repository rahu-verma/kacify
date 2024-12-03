import { Schema, model } from "mongoose";

export type PermissionType = {
  _id: string;
  name: string;
  description: string;
};

const schema = new Schema<PermissionType>({
  name: {
    type: String,
    required: true,
    minlength: 1,
  },
  description: {
    type: String,
    required: true,
    minlength: 1,
  },
});

export const PermissionModelName = "Permission";

const PermissionModel = model<PermissionType>(PermissionModelName, schema);

PermissionModel.syncIndexes();

export default PermissionModel;
