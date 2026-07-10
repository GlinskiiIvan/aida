export interface ResponseFindAll<T> {
    data: T;
    totalPages: number;
    totalItems: number;
    currentPage: number;
};