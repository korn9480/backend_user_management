export interface PaginationOptions {
    page: number;
    limit: number;
    search?: string;
}

export interface PaginationMeta {
    current_page: number;
    has_next: boolean;
    limit: number;
    total_items: number;
    total_pages: number;
}

export interface PaginatedResponse<T> {
    status: string;
    message: string;
    data: T[];
    pagination: PaginationMeta;
}

export class PaginationHelper {
    /**
     * Calculate pagination metadata
     */
    public static calculatePagination(
        totalItems: number,
        currentPage: number,
        limit: number
    ): PaginationMeta {
        const totalPages = Math.ceil(totalItems / limit);
        const hasNext = currentPage < totalPages;

        return {
            current_page: currentPage,
            has_next: hasNext,
            limit: limit,
            total_items: totalItems,
            total_pages: totalPages
        };
    }

    /**
     * Calculate skip value for database queries
     */
    public static calculateSkip(page: number, limit: number): number {
        return (page - 1) * limit;
    }

    /**
     * Validate and sanitize pagination parameters
     */
    public static validatePaginationParams(page?: string, limit?: string): {
        page: number;
        limit: number;
    } {
        // Default values
        let validPage = 1;
        let validLimit = 10;

        // Validate page
        if (page) {
            const parsedPage = parseInt(page, 10);
            if (!isNaN(parsedPage) && parsedPage > 0) {
                validPage = parsedPage;
            }
        }

        // Validate limit (max 100 to prevent abuse)
        if (limit) {
            const parsedLimit = parseInt(limit, 10);
            if (!isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 100) {
                validLimit = parsedLimit;
            }
        }

        return {
            page: validPage,
            limit: validLimit
        };
    }
}
