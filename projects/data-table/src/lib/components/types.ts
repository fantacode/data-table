import { DataTableRowComponent } from './row/row.component';
import { DataTableColumnDirective } from './column/column.component';


export type RowCallback = (item: any, row: DataTableRowComponent, index: number) => string;

export type CellCallback = (item: any, row: DataTableRowComponent, column: DataTableColumnDirective, index: number) => string;

// export type HeaderCallback = (column: DataTableColumn) => string;


export interface DataTableTranslations {
    indexColumn: string;
    selectColumn: string;
    expandColumn: string;
    paginationLimit: string;
    paginationRange: string;
}

export const defaultTranslations = {
    indexColumn: 'index',
    selectColumn: 'select',
    expandColumn: 'expand',
    paginationLimit: 'Limit',
    paginationRange: 'Results'
} as DataTableTranslations;

export interface SearchParam {
    column: string;
    term: string;
}

export interface DataTableParams {
    offset?: number;
    limit?: number;
    sortBy?: string;
    sortAsc?: boolean;
    search?: SearchParam[];
}

export class DataTableResource<T> {

    constructor(private items: T[]) {}

    query(params: DataTableParams, filter?: (item: T, index: number, items: T[]) => boolean): Promise<T[]> {

        let result: T[] = [];
        if (filter) {
            result = this.items.filter(filter);
        } else {
            result = this.items.slice(); // shallow copy to use for sorting instead of changing the original
        }

        if (params.sortBy) {
            result.sort((a: any, b: any) => {
                if (params.sortBy && typeof a[params.sortBy] === 'string') {
                    return a[params.sortBy].localeCompare(b[params.sortBy]);
                } else if (params.sortBy) {
                    return a[params.sortBy] - b[params.sortBy];
                }
                else { return []; }
            });
            if (params.sortAsc === false) {
                result.reverse();
            }
        }
        if (params.offset !== undefined) {
            if (params.limit === undefined) {
                result = result.slice(params.offset, result.length);
            } else {
                result = result.slice(params.offset, params.offset + params.limit);
            }
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(result));
        });
    }

    count(): Promise<number> {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(this.items.length));
        });

    }
}
