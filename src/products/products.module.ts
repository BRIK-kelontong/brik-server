// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module'; // Import AuthModule

@Module({
  imports: [PrismaModule, AuthModule], // Import PrismaModule dan AuthModule
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}