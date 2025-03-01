import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  apiUrl : string = "https://localhost:7246/api/discounts";
  constructor(private http:HttpClient) { }

    //get all coupons
    getCoupons():Observable<any>{
      const accessToken =  localStorage.getItem("token");
      const headers = new HttpHeaders({ 'Authorization':`Bearer ${accessToken}` });
      return this.http.get<any>(`${this.apiUrl}/GetAllCoupons`, {headers});
    }

    //get coupon by couponId : no idea where to use this one
    getCouponByCouponId(couponId:number):Observable<any>{
      const accessToken =  localStorage.getItem("token");
      const headers = new HttpHeaders({ 'Authorization':`Bearer ${accessToken}` });
      return this.http.get(`${this.apiUrl}/GetCouponById/${couponId}`, {headers});
    }

    //create coupon
    createCoupons(data:any):Observable<any>{
      const accessToken =  localStorage.getItem("token");
      const headers = new HttpHeaders({ 'Authorization':`Bearer ${accessToken}` });
      return this.http.post<any>(`${this.apiUrl}/createCoupon`,data, {headers});
    }
  //assign coupon
  assignCouponByUserId (couponId:number, userId:number):Observable<any>{
    const accessToken = localStorage.getItem("token"); // ✅ Get the token

    if (!accessToken) {
      console.error("No access token found. User might not be logged in.");
      return new Observable(observer => {
        observer.error("Unauthorized: No access token found.");
      });
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${accessToken}` });

    return this.http.post(`${this.apiUrl}/assign/${couponId}/to-user/${userId}`, {}, { headers });
  }

    //deactivate coupon
    deactivateCoupon(couponId:number, data:boolean):Observable<any>{
      const accessToken =  localStorage.getItem("token");
      const headers = new HttpHeaders({ 'Authorization':`Bearer ${accessToken}`});
      return this.http.put(`${this.apiUrl}/deactivate/${couponId}`, data, {headers});
    }
    //delete coupon
    deleteCoupon(couponId:number):Observable<any>{
      const accessToken =  localStorage.getItem("token");
      const headers = new HttpHeaders({ 'Authorization':`Bearer ${accessToken}`});
      return this.http.delete(`${this.apiUrl}/delete/${couponId}`, {headers})
    }
}
