export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface TableRow {
  id: number;
  [key: string]: unknown;
}

export interface TableResponse {
  data: TableRow[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SortState {
  column: string;
  direction: 'asc' | 'desc' | '';
}
