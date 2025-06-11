import express, { Application } from 'express';
import { mainRouter } from './route';
import { envConfig } from './config/environment';
import { connectDatabase, disconnectDatabase } from './config/database';
import cors from 'cors';
import { seedController } from './controller/seedController';

class Server {
    private app: Application;
    private port: number;

    constructor() {
        this.app = express();
        this.port = envConfig.PORT;
        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private initializeMiddlewares(): void {
        // Parse JSON bodies
        this.app.use(express.json());
        
        // Parse URL-encoded bodies
        this.app.use(express.urlencoded({ extended: true }));

        // Development logging
        if (envConfig.NODE_ENV === 'development') {
            this.app.use((req, res, next) => {
                console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
                next();
            });
        }
    }

    private initializeRoutes(): void {
        this.app.use(cors({
            origin: '*',
        }));
        // Use main router with API prefix
        this.app.use("/api/v1", mainRouter);

        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({
                status: 'error',
                message: 'Route not found',
                path: req.originalUrl,
            });
        });
    }

    public async start(): Promise<void> {
        // try {
            // Connect to database first
            await connectDatabase();
            await seedController.seedRolePermissions()

            // Start server
            this.app.listen(this.port, () => {
                console.log(`🚀 Server is running on port ${this.port}`);
                console.log(`📡 Health check: http://localhost:${this.port}/api/v1/health`);
                console.log(`🌍 Environment: ${envConfig.NODE_ENV}`);
                console.log('');
            });
        // } catch (error) {
            // console.error('❌ Failed to start server:', error);
            // process.exit(1);
        // }
    }
}

// Start the server
const server = new Server();
server.start();
