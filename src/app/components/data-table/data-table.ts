import { Component, input, output, computed, signal } from '@angular/core';
import { TableColumn, TableRow, SortState } from '../../models/table.models';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable {
  readonly columns = input.required<TableColumn[]>();
  readonly rows = input.required<TableRow[]>();
  readonly totalItems = input<number>(0);
  readonly currentPage = input<number>(1);
  readonly pageSize = input<number>(10);
  readonly loading = input<boolean>(false);

  readonly sortChange = output<SortState>();
  readonly pageChange = output<number>();
  readonly rowEdit = output<TableRow>();
  readonly rowDelete = output<number>();

  readonly sortState = signal<SortState>({ column: '', direction: '' });

  readonly totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    const end = Math.min(total, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  });

  onSort(column: TableColumn): void {
    if (!column.sortable) return;

    const current = this.sortState();
    let direction: 'asc' | 'desc' | '' = 'asc';

    if (current.column === column.key) {
      direction = current.direction === 'asc' ? 'desc' : current.direction === 'desc' ? '' : 'asc';
    }

    const newState: SortState = { column: direction ? column.key : '', direction };
    this.sortState.set(newState);
    this.sortChange.emit(newState);
  }

  getSortIcon(column: TableColumn): string {
    if (!column.sortable) return '';
    const current = this.sortState();
    if (current.column !== column.key) return '↕';
    return current.direction === 'asc' ? '↑' : current.direction === 'desc' ? '↓' : '↕';
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return;
    this.pageChange.emit(page);
  }

  onEdit(row: TableRow): void {
    this.rowEdit.emit(row);
  }

  onDelete(id: number): void {
    this.rowDelete.emit(id);
  }

  getCellValue(row: TableRow, key: string): string {
    const value = row[key];
    return value != null ? String(value) : '';
  }
}
