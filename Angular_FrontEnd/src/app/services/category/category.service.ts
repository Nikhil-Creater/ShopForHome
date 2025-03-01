import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = "https://localhost:7246/api/category";
  constructor(private http: HttpClient) { }

  getCategories():Observable<any[]>{
    const accessToken =  localStorage.getItem("token");
    const headers = new HttpHeaders({ 'Authorization':`Bearer ${accessToken}` });
    return this.http.get<any>(`${this.apiUrl}/GetAllCategories`, {headers});
   }
   createCategory(categoryData: any): Observable<any> {
    const accessToken =  localStorage.getItem("token");
    const headers = new HttpHeaders({ 'Authorization':`Bearer ${accessToken}` });
    return this.http.post<any>(`${this.apiUrl}/CreateCategory`, categoryData, {headers});
  }
  deleteCategory(categoryId: number): Observable<any> {
    const accessToken =  localStorage.getItem("token");
    const headers = new HttpHeaders({ 'Authorization':`Bearer ${accessToken}` });
    return this.http.delete<any>(`${this.apiUrl}/delete/${categoryId}`, {headers});
  }
}
