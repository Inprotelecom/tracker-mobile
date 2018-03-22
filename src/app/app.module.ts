import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage} from '../pages/login/login';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {PendientesComponent} from '../pages/pendientes/pendientes.component';
import {TerminadosComponent} from '../pages/terminados/terminados.component';

import { Upload } from '../pages/upload/upload';
import { UploadList } from '../pages/upload/upload-list';


//Servicios
import { ListaDeseosService } from './services/lista-deseos.service';

//Plugins Providers
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Camera,CameraOptions} from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { DbManagerProvider } from '../providers/db-manager/db-manager';
import { LoginProvider } from '../providers/login/login';
import { StorageProvider } from '../providers/storage/storage';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    LoginPage,
    PendientesComponent,
    TerminadosComponent,
    Upload,
    UploadList
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    LoginPage,
    PendientesComponent,
    TerminadosComponent,
    Upload,
    UploadList
  ],
  providers: [
    ListaDeseosService,
    StatusBar,
    SplashScreen,
    SQLite,
    Camera,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DbManagerProvider,
    LoginProvider,
    StorageProvider,
    Storage
  ]
})
export class AppModule {}
