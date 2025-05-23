export interface ApiResponse<T> {
    status: string;
    message: string;
    data?: T;
}

export interface ApiResponseVaildato<T> {
    status: string;
    message: string;
    error: T;
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