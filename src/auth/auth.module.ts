import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { AuthController } from "./auth.controller"
import { PrismaModule } from "../prisma/prisma.module"
import { AuthService } from "./auth.service"
import { JwtStrategy } from "./jwt.strategy"
import { UsersModule } from "src/users/users.module"

@Module({
    imports: [
        UsersModule,
        PrismaModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: "1h" },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }

