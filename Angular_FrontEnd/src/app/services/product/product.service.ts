import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://localhost:7246/api/Products';
  constructor(private http: HttpClient) {}

  //get users

  getAllProducts(): Observable<any[]> {
    const accessToken = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${accessToken}` });
    return this.http.get<any[]>(`${this.apiUrl}/GetAllProduct`, { headers });
  }

  getProductById(productId: number): Observable<any> {
    const accessToken = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${accessToken}` });
    return this.http.get<any>(`${this.apiUrl}/GetProductById/${productId}`, {
      headers,
    });
  }

  createProduct(productData: any): Observable<any> {
    const accessToken = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${accessToken}` });
    return this.http.post<any>(`${this.apiUrl}/AddProduct`, productData, {
      headers,
    });
  }

  updateProduct(userId: number, userData: any): Observable<any> {
    const accessToken = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${accessToken}` });
    return this.http.put<any>(
      `${this.apiUrl}/UpdateProduct/${userId}`,
      userData,
      { headers }
    );
  }

  updateStock(productId: number, quantity: number) {
    const accessToken = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${accessToken}` });

    return this.http.patch<any>(
      `${this.apiUrl}/UpdateStock/${productId}`,
      JSON.stringify(quantity),  // ✅ Fix: Send as a raw number in JSON format
      { headers: headers.set('Content-Type', 'application/json') } // ✅ Set content type
    );
}


  deleteProduct(productId: number): Observable<any> {
    const accessToken = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${accessToken}` });
    return this.http.delete<any>(`${this.apiUrl}/DeleteProduct/${productId}`, {
      headers,
    });
  }

  getCategories(): Observable<any[]> {
    const accessToken = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${accessToken}` });
    return this.http.get<any>(
      `https://localhost:7246/api/category/GetAllCategories`,
      { headers }
    );
  }

  uploadProductsCSV(fileData: FormData): Observable<any> {
    const accessToken = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${accessToken}` });
    return this.http.post(`${this.apiUrl}/BulkUpload`, fileData, { headers });
  }
}
