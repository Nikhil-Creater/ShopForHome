import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private lastOrder: any = null;

  saveOrder(order: any) {
    this.lastOrder = order;
  }

  getLastOrder() {
    return this.lastOrder;
  }

}