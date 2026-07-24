/**
 * Custom application error class.
 * Lets controllers/services throw errors with an explicit HTTP status code
 * and an optional list of field-level validation errors, which the
 * centralized error handler then turns into a consistent JSON response.
 */
export class ApiError extends Error {
  public statusCode: number;
  public errors: string[];

  constructor(statusCode: number, message: string, errors: string[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string, errors: string[] = []) {
    return new ApiError(400, message, errors);
  }

  static notFound(message: string) {
    return new ApiError(404, message);
  }

  static internal(message = "Internal server error") {
    return new ApiError(500, message);
  }
}
