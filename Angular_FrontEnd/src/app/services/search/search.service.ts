import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'https://localhost:7246/api/Search/GetFilteredProducts';

  constructor(private http: HttpClient) {}

  // ✅ API call with dynamic parameters
  getFilteredProducts(filters: any): Observable<any[]> {
    let params = new HttpParams();

    Object.keys(filters).forEach((key) => {
      if (filters[key] !== null && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });

    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
