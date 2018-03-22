import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Upload } from '../pages/upload/upload';
import { UploadList } from '../pages/upload/upload-list';

//Pages
import {PendientesComponent} from '../pages/pendientes/pendientes.component';
import {TerminadosComponent} from '../pages/terminados/terminados.component';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage} from '../pages/login/login';

//Servicios
import { ListaDeseosService } from './services/lista-deseos.service';

//Plugins Providers
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Camera,CameraOptions} from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { DbManagerProvider } from '../providers/db-manager/db-manager';
import { LoginProvider } from '../providers/login/login';
import { StorageProvider } from '../providers/storage/storage';

//REpositories

import { UserAreaRepository} from '../providers/repository/user-area';


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
    Storage,
    UserAreaRepository
  ]
})
export class AppModule {}
