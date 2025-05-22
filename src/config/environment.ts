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

    constructor() {
        dotenv.config({path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`)});
        this.NODE_ENV = process.env.NODE_ENV || 'development';
        this.PORT = parseInt(process.env.PORT || '3000', 10);
    }
}

export const envConfig = new Environment();
