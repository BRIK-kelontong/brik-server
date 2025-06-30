// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (optional, for development)
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      username: 'testuser',
      password: hashedPassword,
    },
  });
  console.log('Test user created: testuser/password123');

  // Create products
  const productsData = [
    {
      categoryId: 1,
      categoryName: 'Snacks',
      sku: 'CK001',
      name: 'Chiki Ball Keju',
      description: 'Cemilan enak rasa keju',
      weight: 100,
      width: 10,
      length: 15,
      height: 5,
      image: 'https://solvent-production.s3.amazonaws.com/media/images/products/2023/02/DSC_0522.JPG',
      price: 5000,
    },
    {
      categoryId: 1,
      categoryName: 'Snacks',
      sku: 'KT002',
      name: 'Qtela Balado',
      description: 'Keripik singkong rasa balado',
      weight: 150,
      width: 12,
      length: 18,
      height: 6,
      image: 'https://solvent-production.s3.amazonaws.com/media/images/products/2021/06/DSC_0086_copy_9m35jqX.jpg',
      price: 6500,
    },
    {
      categoryId: 2,
      categoryName: 'Drinks',
      sku: 'AQ003',
      name: 'Aqua Botol 600ml',
      description: 'Air mineral jernih',
      weight: 600,
      width: 7,
      length: 7,
      height: 20,
      image: 'https://solvent-production.s3.amazonaws.com/media/images/products/2021/06/DSC_0047_copy_TaS0jlu.jpg',
      price: 3000,
    },
    {
      categoryId: 2,
      categoryName: 'Drinks',
      sku: 'TEH004',
      name: 'Teh Pucuk Harum',
      description: 'Minuman teh kemasan',
      weight: 350,
      width: 6,
      length: 6,
      height: 15,
      image: 'https://solvent-production.s3.amazonaws.com/media/images/products/2021/03/8996001600207.jpg',
      price: 4000,
    },
    {
      categoryId: 3,
      categoryName: 'Staple Foods',
      sku: 'MR005',
      name: 'Indomie Goreng',
      description: 'Mie instan favorit sejuta umat',
      weight: 85,
      width: 10,
      length: 12,
      height: 3,
      image: 'https://image.astronauts.cloud/product-images/2024/4/IndomieGorengSpesialMieinstan1_19ed38d5-421f-4813-bd66-25cf83f1909c_900x900.png',
      price: 2500,
    },
    {
      categoryId: 3,
      categoryName: 'Staple Foods',
      sku: 'BRS006',
      name: 'Beras Raja 1kg',
      description: 'Beras pulen pilihan',
      weight: 1000,
      width: 15,
      length: 20,
      height: 8,
      image: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/111/MTA-178396607/anak_raja_anak_raja_1kg_beras_pulen_dan_enak_beras_premium_berkualitas_dengan_rasa_enak_bahan_pokok_rice_premium_rices_anakraja_1_kilo_1_kg_full01_ib4fzzny.jpg',
      price: 15000,
    },
    // Tambahkan lebih banyak produk di sini hingga 100
    // Contoh loop untuk menambahkan lebih banyak dummy product
    ...Array.from({ length: 94 }, (_, i) => ({
      categoryId: (i % 3) + 1,
      categoryName: ['Snacks', 'Drinks', 'Staple Foods'][i % 3],
      sku: `DUMMY${String(i + 7).padStart(3, '0')}`,
      name: `Dummy Product ${i + 7}`,
      description: `Ini adalah produk dummy ke-${i + 7}`,
      weight: Math.floor(Math.random() * 1000) + 50,
      width: Math.floor(Math.random() * 10) + 5,
      length: Math.floor(Math.random() * 10) + 5,
      height: Math.floor(Math.random() * 10) + 5,
      image: `https://picsum.photos/id/${i + 10}/200/300`, // Contoh gambar dummy
      price: Math.floor(Math.random() * 50000) + 1000,
    })),
  ];

  for (const product of productsData) {
    await prisma.product.create({ data: product });
  }
  console.log('Products seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });