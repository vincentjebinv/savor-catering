
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkDb() {
  try {
    const userCount = await prisma.user.count();
    const dishCount = await prisma.dish.count();
    const orderCount = await prisma.order.count();
    
    console.log('📊 Database Status:');
    console.log(`- Users: ${userCount}`);
    console.log(`- Dishes: ${dishCount}`);
    console.log(`- Orders: ${orderCount}`);
    
    if (userCount > 0) {
      const firstUser = await prisma.user.findFirst();
      console.log(`- First User Email: ${firstUser.email}`);
    }
  } catch (e) {
    console.error('❌ Database Connection Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
