import { Component, OnInit, signal } from '@angular/core';
import { DataTable } from '../../components/data-table/data-table';
import { ItemForm } from '../../components/item-form/item-form';
import { TableService } from '../../services/table.service';
import { TableColumn, TableRow, SortState } from '../../models/table.models';

@Component({
  selector: 'app-table-page',
  imports: [DataTable, ItemForm],
  templateUrl: './table-page.html',
  styleUrl: './table-page.scss',
})
export class TablePage implements OnInit {
  readonly columns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'firstName', label: 'First Name', sortable: true },
    { key: 'lastName', label: 'Last Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ];

  readonly rows = signal<TableRow[]>([]);
  readonly totalItems = signal(0);
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly loading = signal(false);
  readonly searchQuery = signal('');
  readonly showForm = signal(false);
  readonly editingItem = signal<TableRow | null>(null);

  private sortColumn = '';
  private sortDirection = '';

  constructor(private readonly tableService: TableService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.tableService
      .getItems(
        this.currentPage(),
        this.pageSize(),
        this.sortColumn,
        this.sortDirection,
        this.searchQuery()
      )
      .subscribe({
        next: (response) => {
          this.rows.set(response.data);
          this.totalItems.set(response.total);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  onSortChange(sort: SortState): void {
    this.sortColumn = sort.column;
    this.sortDirection = sort.direction;
    this.currentPage.set(1);
    this.loadData();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadData();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.currentPage.set(1);
    this.loadData();
  }

  openCreateForm(): void {
    this.editingItem.set(null);
    this.showForm.set(true);
  }

  onEdit(row: TableRow): void {
    this.editingItem.set(row);
    this.showForm.set(true);
  }

  onDelete(id: number): void {
    if (!confirm('Are you sure you want to delete this item?')) return;

    this.tableService.deleteItem(id).subscribe({
      next: () => this.loadData(),
    });
  }

  onSave(item: Partial<TableRow>): void {
    const request$ = item['id']
      ? this.tableService.updateItem(item['id'] as number, item)
      : this.tableService.createItem(item);

    request$.subscribe({
      next: () => {
        this.showForm.set(false);
        this.editingItem.set(null);
        this.loadData();
      },
    });
  }

  onCancelForm(): void {
    this.showForm.set(false);
    this.editingItem.set(null);
  }
}
