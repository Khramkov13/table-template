import { Component, input, output, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableRow } from '../../models/table.models';

@Component({
  selector: 'app-item-form',
  imports: [FormsModule],
  templateUrl: './item-form.html',
  styleUrl: './item-form.scss',
})
export class ItemForm implements OnInit {
  readonly item = input<TableRow | null>(null);
  readonly save = output<Partial<TableRow>>();
  readonly cancel = output<void>();

  readonly name = signal('');
  readonly email = signal('');
  readonly role = signal('');
  readonly status = signal('active');

  readonly isEdit = signal(false);

  ngOnInit(): void {
    const current = this.item();
    if (current) {
      this.isEdit.set(true);
      this.name.set(String(current['name'] ?? ''));
      this.email.set(String(current['email'] ?? ''));
      this.role.set(String(current['role'] ?? ''));
      this.status.set(String(current['status'] ?? 'active'));
    }
  }

  onSubmit(): void {
    if (!this.name() || !this.email()) return;

    const data: Partial<TableRow> = {
      name: this.name(),
      email: this.email(),
      role: this.role(),
      status: this.status(),
    };

    if (this.isEdit()) {
      data['id'] = this.item()!.id;
    }

    this.save.emit(data);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
