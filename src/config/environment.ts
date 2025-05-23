import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

export interface EnvironmentConfig {
    NODE_ENV: string;
    PORT: number;
    API_VERSION: string;
    LOG_LEVEL: string;
    CORS_ORIGIN: string;
}

class Environment {
    public readonly NODE_ENV: string;
    public readonly PORT: number;
    public readonly HOST: string;
    public readonly DATABASE_USER: string;
    public readonly DATABASE_PASSWORD: string;
    public readonly DATABASE_NAME: string

    constructor() {
        dotenv.config({path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`)});
        this.NODE_ENV = process.env.NODE_ENV || 'development';
        this.PORT = parseInt(process.env.PORT || '3000', 10);
        this.HOST = process.env.HOST || '';
        this.DATABASE_USER = process.env.DATABASE_USER || ''
        this.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || ''
        this.DATABASE_NAME = process.env.DATABASE_NAME || ''
    }
}

export const envConfig = new Environment();
