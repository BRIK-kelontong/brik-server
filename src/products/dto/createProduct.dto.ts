
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateProductDto {
  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  weight: number;

  @IsInt()
  @Min(0)
  width: number;

  @IsInt()
  @Min(0)
  length: number;

  @IsInt()
  @Min(0)
  height: number;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsInt()
  @Min(0)
  price: number;
}