
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds 10
    try {
      const user = await this.prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      if (error.code === 'P2002') { // Unique constraint violation
        throw new BadRequestException('Username already exists');
      }
      throw error;
    }
  }

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}