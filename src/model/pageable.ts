export type PageInfo = {
    pageNumber: number
    pageSize: number,
    totalPage: number
}

export type PageData<T> = {
    data: Array<T>,
    pageInfo: PageInfo
}

export type PageRequest = {
    pageNumber: number
    pageSize: number,
}