import { ZodError } from "zod";
export function notFoundHandler(req, res) {
    return res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`,
    });
}
export function errorHandler(err, _req, res, _next) {
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.issues,
        });
    }
    if (err instanceof Error) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
}
