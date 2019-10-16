export interface PaginatedResponse<T> {
	data: T[];
	offset: number;
	limit: number;
	totalCount: number;
	isLoading: boolean;
}
