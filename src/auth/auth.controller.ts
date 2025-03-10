import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common"
import { LoginDto } from "./dto/login.dto"
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }
}

