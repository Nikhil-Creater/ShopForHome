import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartComponent } from './components/cart/cart.component';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { AdminPageComponent } from './admin-functionalities/admin-page/admin-page.component';
import { UserUpdateComponent } from './admin-functionalities/user-crud/user-update/user-update.component';
import { UserDeleteComponent } from './admin-functionalities/user-crud/user-delete/user-delete.component';
import { ProductUpdateComponent } from './admin-functionalities/product-crud/product-update/product-update.component';
import { ProductDeleteComponent } from './admin-functionalities/product-crud/product-delete/product-delete.component';
import { ProductCreateComponent } from './admin-functionalities/product-crud/product-create/product-create.component';
import { CategoryCreateComponent } from './admin-functionalities/category-crud/category-create/category-create.component';
import { CategoryDeleteComponent } from './admin-functionalities/category-crud/category-delete/category-delete.component';
import { OrderComponent } from './components/order/order.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { UserDetailsComponent } from './admin-functionalities/user-crud/user-details/user-details.component';
import { CategoryDetailsComponent } from './admin-functionalities/category-crud/category-details/category-details.component';
import { ProductDetailsComponent } from './admin-functionalities/product-crud/product-details/product-details.component';
import { CouponAssignComponent } from './admin-functionalities/coupons-crud/coupon-assign/coupon-assign.component';
import { CouponCreateComponent } from './admin-functionalities/coupons-crud/coupon-create/coupon-create.component';
import { CouponDetailsComponent } from './admin-functionalities/coupons-crud/coupon-details/coupon-details.component';
import { CouponDeactivateComponent } from './admin-functionalities/coupons-crud/coupon-deactivate/coupon-deactivate.component';
import { CouponDeleteComponent } from './admin-functionalities/coupons-crud/coupon-delete/coupon-delete.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SalesReportDetailsComponent } from './admin-functionalities/sales-report/sales-report-details/sales-report-details.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'Admin', component: AdminPageComponent },
  { path: 'update-user/:id', component: UserUpdateComponent },
  { path: 'delete-user/:id', component: UserDeleteComponent },
  { path: 'update-product/:id', component: ProductUpdateComponent },
  { path: 'delete-product/:id', component: ProductDeleteComponent },
  { path: 'add-product', component: ProductCreateComponent },
  { path: 'add-category', component: CategoryCreateComponent },
  { path: 'delete-category/:id', component: CategoryDeleteComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order', component: OrderComponent },
  { path: 'admin/users', component: UserDetailsComponent },
  { path: 'admin/categories', component: CategoryDetailsComponent },
  { path: 'admin/products', component: ProductDetailsComponent },
  { path: 'app', component: AppComponent },
  { path: 'Admin/coupons', component: CouponDetailsComponent },
  { path: 'coupons-create', component: CouponCreateComponent },
  { path: 'coupons-assign/:id', component: CouponAssignComponent },
  { path: 'coupons-deactivate/:id', component: CouponDeactivateComponent },
  { path: 'coupons-delete/:id', component: CouponDeleteComponent },
  { path: 'notifications', component: NotificationsComponent },
  {path: 'Admin/sale-report', component: SalesReportDetailsComponent},
  {
    path: '',
    redirectTo: 'LoginAndSignUp',
    pathMatch: 'full',
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
