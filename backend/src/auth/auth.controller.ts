import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registrar')
  async registrar(
    @Body() body: { email: string; password: string; name?: string },
  ) {
    console.log('POST /auth/registrar:', body.email);
    return this.authService.registrar(body.email, body.password, body.name);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    console.log('POST /auth/login:', body.email);
    return this.authService.login(body.email, body.password);
  }
}