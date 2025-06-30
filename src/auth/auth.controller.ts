// src/auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: Record<string, string>) {
    return this.authService.register(body.username, body.password);
  }

  @Post('login')
  async login(@Body() body: Record<string, string>) {
    return this.authService.login(body.username, body.password);
  }
}