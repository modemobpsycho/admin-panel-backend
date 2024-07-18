import { ValidationError } from "express-validator"

export class ApiError extends Error {
  status: number
  errors: ValidationError[] | []

  constructor(status: number, message: string, errors: ValidationError[] | []) {
    super(message)
    this.errors = errors
    this.status = status
  }

  static UnauthorizedError() {
    return new ApiError(401, "User is not authorized", [])
  }

  static BadRequest(message: string, errors: ValidationError[] | [] = []) {
    return new ApiError(400, message, errors)
  }
}
