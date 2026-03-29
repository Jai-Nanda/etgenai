import bcrypt from 'bcryptjs';
import { prisma } from './config/database.js';

const SALT_ROUNDS = 12;

const seedData = {
  users: [
    {
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'demo123456'
    },
    {
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123456'
    }
  ],

  transactions: [
    // Demo user transactions
    {
      email: 'demo@example.com',
      transactions: [
        { date: '2024-01-15', description: 'Salary Deposit', amount: 5000, type: 'income', category: 'Income' },
        { date: '2024-01-16', description: 'Rent Payment', amount: 1200, type: 'expense', category: 'Bills' },
        { date: '2024-01-17', description: 'Grocery Shopping', amount: 150, type: 'expense', category: 'Food' },
        { date: '2024-01-18', description: 'Uber Ride', amount: 25, type: 'expense', category: 'Travel' },
        { date: '2024-01-19', description: 'Netflix Subscription', amount: 15, type: 'expense', category: 'Entertainment' },
        { date: '2024-01-20', description: 'Restaurant Dinner', amount: 80, type: 'expense', category: 'Food' },
        { date: '2024-01-21', description: 'Amazon Purchase', amount: 120, type: 'expense', category: 'Shopping' },
        { date: '2024-01-22', description: 'Electricity Bill', amount: 85, type: 'expense', category: 'Bills' },
        { date: '2024-01-23', description: 'Coffee Shop', amount: 12, type: 'expense', category: 'Food' },
        { date: '2024-01-24', description: 'Gas Station', amount: 45, type: 'expense', category: 'Travel' },
        { date: '2024-01-25', description: 'Freelance Payment', amount: 800, type: 'income', category: 'Income' },
        { date: '2024-01-26', description: 'Gym Membership', amount: 50, type: 'expense', category: 'Health' },
        { date: '2024-01-27', description: 'Movie Tickets', amount: 30, type: 'expense', category: 'Entertainment' },
        { date: '2024-01-28', description: 'Pharmacy', amount: 25, type: 'expense', category: 'Health' },
        { date: '2024-01-29', description: 'Online Course', amount: 99, type: 'expense', category: 'Education' }
      ]
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clean existing data
    await prisma.transaction.deleteMany();
    await prisma.uploadedFile.deleteMany();
    await prisma.user.deleteMany();
    console.log('🧹 Cleaned existing data');

    // Create users
    const createdUsers = {};
    
    for (const userData of seedData.users) {
      const passwordHash = await bcrypt.hash(userData.password, SALT_ROUNDS);
      
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          passwordHash
        }
      });
      
      createdUsers[userData.email] = user;
      console.log(`👤 Created user: ${userData.email}`);
    }

    // Create transactions
    for (const userTransactions of seedData.transactions) {
      const user = createdUsers[userTransactions.email];
      
      if (user) {
        for (const transaction of userTransactions.transactions) {
          await prisma.transaction.create({
            data: {
              userId: user.id,
              date: new Date(transaction.date),
              description: transaction.description,
              amount: transaction.amount,
              type: transaction.type,
              category: transaction.category,
              sourceFileName: 'seed_data.csv'
            }
          });
        }
        
        console.log(`💰 Created ${userTransactions.transactions.length} transactions for ${userTransactions.email}`);
      }
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('   Email: demo@example.com | Password: demo123456');
    console.log('   Email: test@example.com | Password: test123456');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase };
