import { ApiResponse } from "../type/response/response";

export class HealthService {
    public getServerHealth(): ApiResponse<undefined> {
        return {
            status: "OK",
            message: "Server is running",
        };
    }
}

export const healthService = new HealthService();