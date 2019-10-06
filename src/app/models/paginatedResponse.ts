import { People } from '.';

export interface PaginatedResponse {
	people: People[];
	offset: number;
	limit: number;
	totalCount: number;
	isLoading: boolean;
}
