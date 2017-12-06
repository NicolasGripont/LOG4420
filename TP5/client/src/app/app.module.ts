import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ProductComponent } from './product/product.component';
import { ContactComponent } from './contact/contact.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { OrderComponent } from './order/order.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductsService } from './products.service';
import { ShoppingCartService } from './shopping-cart.service';
import { OrderService } from './order.service';

import { PriceFormatPipe } from "./pipes/price-format.pipe";
import { ConfirmationNumberFormatPipe } from "./pipes/confirmation-number-format.pipe";

// Application routes
const appRoutes: Routes = [
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: 'accueil', component: HomeComponent, pathMatch: 'full'  },
  { path: 'produits', component: ProductsComponent, pathMatch: 'full'  },
  { path: 'produits/:id', component: ProductComponent, pathMatch: 'full' },
  { path: 'contact', component: ContactComponent, pathMatch: 'full'  },
  { path: 'panier', component: ShoppingCartComponent, pathMatch: 'full'  },
  { path: 'commande', component: OrderComponent, pathMatch: 'full'  },
  { path: 'confirmation', component: ConfirmationComponent, pathMatch: 'full'  },
  { path: '**', component: PageNotFoundComponent, pathMatch: 'full'  }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductsComponent,
    ProductComponent,
    ContactComponent,
    ShoppingCartComponent,
    OrderComponent,
    ConfirmationComponent,
    PageNotFoundComponent,
    PriceFormatPipe,
    ConfirmationNumberFormatPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    )
  ],
  providers: [
    ProductsService,
    ShoppingCartService,
    OrderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
