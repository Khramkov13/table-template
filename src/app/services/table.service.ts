import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableResponse, TableRow } from '../models/table.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TableService {
  private readonly baseUrl = `${environment.apiUrl}/items`;

  constructor(private readonly http: HttpClient) {}

  getItems(
    page: number,
    pageSize: number,
    sortColumn?: string,
    sortDirection?: string,
    search?: string
  ): Observable<TableResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (sortColumn && sortDirection) {
      params = params.set('sortColumn', sortColumn).set('sortDirection', sortDirection);
    }

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<TableResponse>(this.baseUrl, { params });
  }

  createItem(item: Partial<TableRow>): Observable<TableRow> {
    return this.http.post<TableRow>(this.baseUrl, item);
  }

  updateItem(id: number, item: Partial<TableRow>): Observable<TableRow> {
    return this.http.put<TableRow>(`${this.baseUrl}/${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
