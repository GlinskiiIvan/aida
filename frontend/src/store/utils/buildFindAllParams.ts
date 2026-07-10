export type FindAllParams = {
    sorting?: {
        by: string;
        order: string;
    }
    dateFilter?: {
        dateFrom?: string;
        dateTo?: string;
    }
    search?: {
        field: string;
        value: string;
    };
    pagination?: {
        pageSize: number;
        page?: number;
    }
};

export const buildFindAllParams = (body: FindAllParams) => {
    const sorting = body.sorting ? `&sortBy=${body.sorting.by}&sortOrder=${body.sorting.order}` : '';
    const dateFilter = `${(body.dateFilter && body.dateFilter.dateFrom) ? `&dateFrom=${body.dateFilter.dateFrom}` : ''}${(body.dateFilter && body.dateFilter.dateTo) ? `&dateTo=${body.dateFilter.dateTo}` : ''}`;
    const search = body.search && body.search.field && body.search.value ? `&filterBy=${body.search.field}&filterValue=${body.search.value}` : '';
    const pagination = `${(body.pagination && body.pagination.page) ? `&page=${body.pagination.page}` : ''}${(body.pagination && body.pagination.pageSize) ? `&pageSize=${body.pagination.pageSize}` : ''}`;

    return `${(sorting || dateFilter || search || pagination) ? `?${search}${sorting}${dateFilter}${pagination}` : ''}`;
}                       