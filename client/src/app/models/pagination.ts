export interface MetaData{
    currentPage: number,
    totalPages: number,
    pageSize: number,
    totalCount: number
}


export class PaginatedPage<T>{
    items: T;
    metadata: MetaData;

    constructor(items: T, metaData: MetaData){
        this.items = items;
        this.metadata = metaData
    }

}