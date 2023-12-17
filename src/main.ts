import { enableProdMode,importProvidersFrom} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { RouterModule,Routes } from '@angular/router';
import { environment } from './environments/environment'; //apiキーの設定設定ファイル
import { routeConfig } from './app/routes' //ルーティングの設定ファイル
if (environment.production) {
  enableProdMode();
}

// StandaloneのBootstrap
bootstrapApplication(AppComponent,{
   providers:[importProvidersFrom(RouterModule.forRoot(routeConfig))]
}).catch(err => console.error(err));

