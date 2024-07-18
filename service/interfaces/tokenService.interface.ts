import { JwtPayload } from "jsonwebtoken"
import { UserJwtPayload } from "../../types/userJwtPayload"

export interface ITokenService {
  generateTokens(payload: UserJwtPayload): {
    accessToken: string
    refreshToken: string
  }
  validateAccessToken(token: string): string | JwtPayload | null
  validateRefreshToken(token: string): string | JwtPayload | null
}
