export class PaginatedResponseDto<T> {
    rows: T[];
    count: number;
    page: number;
    lastPage: number;

    constructor(items: T[], count: number, page: number, limit: number) {
        this.rows = items;
        this.count = count;
        this.page = page;
        this.lastPage = Math.ceil(count / limit);
    }
}
