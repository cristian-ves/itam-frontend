export interface ColumnDef {
    label: string;
    format?: (val: any) => string;
}
