
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.count();
  const categories = await prisma.category.count();
  const dishes = await prisma.dish.count();
  console.log({ users, categories, dishes });
  const allCats = await prisma.category.findMany();
  console.log('Categories:', JSON.stringify(allCats, null, 2));
  process.exit(0);
}
check();
