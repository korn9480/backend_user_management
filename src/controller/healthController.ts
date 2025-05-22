import { Request, Response } from 'express';
import { healthService } from '../service/healthService';

export class HealthController {
    public getHealth = (req: Request, res: Response): void => {
        try {
            const healthData = healthService.getServerHealth();
            res.status(200).json(healthData);
        } catch (error) {
            res.status(500).json({
                status: "ERROR",
                message: "Internal Server Error",
                timestamp: new Date()
            });
        }
    };
}

export const healthController = new HealthController();
