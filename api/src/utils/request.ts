import { Response } from "express";

export const response200 = (
  res: Response,
  { message = "success", code = "success", data = {} } = {}
) =>
  res.status(200).json({
    success: true,
    status: 200,
    message,
    code,
    data,
  });

export const response400 = (
  res: Response,
  { message = "bad request", code = "badRequest", data = {} } = {}
) => {
  res.status(400).json({
    success: false,
    status: 400,
    message,
    code,
    data,
  });
};

export const response401 = (
  res: Response,
  { message = "unauthorized", code = "unauthorized", data = {} } = {}
) =>
  res.status(401).json({
    success: false,
    status: 401,
    message,
    code,
    data,
  });

export const response403 = (
  res: Response,
  { message = "forbidden", code = "forbidden", data = {} } = {}
) =>
  res.status(403).json({
    success: false,
    status: 403,
    message,
    code,
    data,
  });

export const response404 = (
  res: Response,
  { message = "not found", code = "notFound", data = {} } = {}
) =>
  res.status(404).json({
    success: false,
    status: 404,
    message,
    code,
    data,
  });

export const response500 = (
  res: Response,
  {
    message = "internal server error",
    code = "internalServerError",
    data = {},
  } = {}
) =>
  res.status(500).json({
    success: false,
    status: 500,
    message,
    code,
    data,
  });
