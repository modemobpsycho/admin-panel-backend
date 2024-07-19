import { sign, verify } from "jsonwebtoken"
import UserJwtPayload from "../types/userJwtPayload"
import { MyConfig } from "../config/config"
import { PrismaClient } from "@prisma/client"
import { ITokenService } from "./interfaces/tokenService.interface"

class TokenService implements ITokenService {
  generateAccessToken(payload: UserJwtPayload) {
    const accessToken = sign(payload, MyConfig.JWT_SECRET!, {
      expiresIn: "30m"
    })
    return accessToken
  }

  generateRefreshToken(payload: UserJwtPayload) {
    const refreshToken = sign(payload, MyConfig.JWT_REFRESH_SECRET!, {
      expiresIn: "60d"
    })
    return refreshToken
  }

  validateAccessToken(token: string) {
    try {
      const userData = verify(token, MyConfig.JWT_SECRET!)
      return userData
    } catch (e) {
      return null
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = verify(token, MyConfig.JWT_REFRESH_SECRET!)
      return userData
    } catch (e) {
      return null
    }
  }
}

export default TokenService
