import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = "https://localhost:7246/api/Users";

  constructor(private http: HttpClient) { }

  //get users

  getUsers(): Observable<any[]>{
    const accessToken =  localStorage.getItem("token");
    const headers = new HttpHeaders({ 'Authorization':`Bearer ${accessToken}` });
    return this.http.get<any[]>(`${this.apiUrl}/GetAllUsers`,{headers});
  }

  getUsersById(userId:number):Observable<any>{
    const accessToken =  localStorage.getItem("token");
    const headers = new HttpHeaders({ 'Authorization':`Bearer ${accessToken}` });
    return this.http.get<any>(`${this.apiUrl}/GetUser/${userId}`,{headers})
  }

  createUser(userData: any): Observable<any> {
    const accessToken =  localStorage.getItem("token");
    const headers = new HttpHeaders({ 'Authorization':`Bearer ${accessToken}` });
    return this.http.post<any>(`${this.apiUrl}`, userData, {headers});
  }

  updateUser(userId:number, userData: any): Observable<any> {
    const accessToken =  localStorage.getItem("token");
    const headers = new HttpHeaders({ 'Authorization':`Bearer ${accessToken}` });
    return this.http.put<any>(`${this.apiUrl}/UpdateUser/${userId}`, userData, {headers});
  }

  deleteUser(userId: number): Observable<any> {
    const accessToken =  localStorage.getItem("token");
    const headers = new HttpHeaders({ 'Authorization':`Bearer ${accessToken}` });
    return this.http.delete<any>(`${this.apiUrl}/DeleteUser/${userId}`, {headers});
  }

}
