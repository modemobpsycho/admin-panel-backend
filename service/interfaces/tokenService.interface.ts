import { JwtPayload } from "jsonwebtoken"
import UserJwtPayload from "../../types/userJwtPayload"

export interface ITokenService {
  generateAccessToken(payload: UserJwtPayload)
  generateRefreshToken(payload: UserJwtPayload)
  validateAccessToken(token: string): string | JwtPayload | null
  validateRefreshToken(token: string): string | JwtPayload | null
}
