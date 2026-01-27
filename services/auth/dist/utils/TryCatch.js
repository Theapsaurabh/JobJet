import ErrorHandler from "./errorHandler.js";
export const tryCatch = (controller) => async (req, res, next) => {
    try {
        await controller(req, res, next);
    }
    catch (error) {
        if (error instanceof ErrorHandler) {
            return res.status(error.statusCode).json({
                message: error.message,
            });
        }
        console.error(error);
        return res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};
//# sourceMappingURL=TryCatch.js.map