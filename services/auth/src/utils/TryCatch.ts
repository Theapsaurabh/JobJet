import type { Request, Response, NextFunction, RequestHandler } from "express";
import ErrorHandler from "./errorHandler.js";

export const tryCatch =
  (controller: RequestHandler): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({
          message: error.message,
        });
      }

      console.error(error);

      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  };
