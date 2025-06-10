import {PrismaClient} from '../../generated/prisma'
import { envConfig } from './environment';

// Database connection configuration
export const databaseConfig = {
    host: envConfig.HOST,
    user: envConfig.DATABASE_USER,
    password: envConfig.DATABASE_PASSWORD,
    database: envConfig.DATABASE_NAME,
    // Add more database configs as needed
};

// Initialize Prisma Client
export const prisma = new PrismaClient({
    log: envConfig.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Database connection function
export const connectDatabase = async (): Promise<void> => {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

// Graceful shutdown
export const disconnectDatabase = async (): Promise<void> => {
    try {
        await prisma.$disconnect();
        console.log('🔌 Database disconnected');
    } catch (error) {
        console.error('❌ Database disconnection failed:', error);
    }
};
