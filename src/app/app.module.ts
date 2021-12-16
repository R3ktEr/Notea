import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire/compat'
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ServiceWorkerModule } from '@angular/service-worker'
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LocalStorageService } from './services/local-storage.service';
import { AuthService } from './services/auth.service';
import { AuthguardService } from './services/authguard.service';
import { NgxQRCodeModule } from 'ngx-qrcode2';

export function loadTranslator(http: HttpClient){
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    TranslateModule.forRoot({
      loader:{
        provide: TranslateLoader,
        useFactory: (loadTranslator),
        deps:[HttpClient]
      }
    }),
    NgxQRCodeModule
  ],

  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy},LocalStorageService, AuthService,AuthguardService],
  bootstrap: [AppComponent],
})
export class AppModule {}
