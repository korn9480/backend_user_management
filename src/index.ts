import express, { Application } from 'express';
import { mainRouter } from './route';
import { envConfig } from './config/environment';

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
    }

    private initializeRoutes(): void {
        // Use main router
        this.app.use(mainRouter);
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`🚀 Server is running on port ${this.port}`);
            console.log(`📡 Health check available at: http://localhost:${this.port}/api/v1/health`);
        });
    }
}

// Start the server
const server = new Server();
server.start();
