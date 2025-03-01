import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleReportService {
  private apiUrl = 'https://localhost:7246/api/SalesReports';

  constructor(private http: HttpClient) {}

  getAllSalesReports():Observable<any>{
    const accessToken =  localStorage.getItem("token");
    const headers = new HttpHeaders({ 'Authorization':`Bearer ${accessToken}` });
    return this.http.get<any>(`${this.apiUrl}/GetAllSalesReports`, {headers});
  }

  // ✅ API Call for Generating Sales Report
  generateSalesReport(startDate: string, endDate: string): Observable<any> {
    const accessToken =  localStorage.getItem("token");
    const headers = new HttpHeaders({ 'Authorization':`Bearer ${accessToken}` });
    return this.http.post<any>(`${this.apiUrl}/GenerateSalesReport?startDate=${startDate}&endDate=${endDate}`, {}, {headers});
  }
}
