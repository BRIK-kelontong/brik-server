
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      return await this.prisma.product.create({
        data: createProductDto,
      });
    } catch (error) {
      if (error.code === 'P2002') { // Unique constraint violation for SKU
        throw new BadRequestException('Product with this SKU already exists');
      }
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ data: Product[]; total: number; page: number; limit: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { categoryName: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          id: 'asc', // Atau sesuai kebutuhan sorting
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: products,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    try {
        return await this.prisma.product.update({
            where: { id },
            data: updateProductDto,
        });
    } catch (error) {
        if (error.code === 'P2002') { // Unique constraint violation for SKU
            throw new BadRequestException('Product with this SKU already exists');
        }
        throw error;
    }
  }

  async remove(id: number): Promise<Product> {
    const existingProduct = await this.prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return await this.prisma.product.delete({ where: { id } });
  }
}