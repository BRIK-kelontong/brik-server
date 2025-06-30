// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback_secret',
    });
  }

  async validate(payload: { sub: number; username: string }) {
    // Di sini Anda bisa mengambil user dari database jika diperlukan
    // Untuk contoh ini, kita hanya mengembalikan payload yang sudah divalidasi
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      return null;
    }
    const { password, ...result } = user; // Hapus password dari objek yang dikembalikan
    return result;
  }
}