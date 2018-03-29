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
import { ProjectPage} from '../pages/project/project';
import { CasesPage} from '../pages/cases/cases';


//Servicios
import { ListaDeseosService } from './services/lista-deseos.service';
import { ProjectProvider } from '../providers/project/project';

//Plugins Providers
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Camera,CameraOptions} from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { DbManagerProvider } from '../providers/db-manager/db-manager';
import { LoginProvider } from '../providers/login/login';
import { StorageProvider } from '../providers/storage/storage';

//Repositories
import { CasesProvider } from '../providers/cases/cases';
import { WorkitemFlowProvider } from '../providers/workitem-flow/workitem-flow';
import { UserAreaRepository} from '../providers/repository/user-area';
import { ProjectSubprojectRepository} from '../providers/repository/project-subproject';
import { CasesRepository} from '../providers/repository/cases';
import { WorkItemElementRepository } from '../providers/repository/workitem-element';
import { ElementTypeConfigAttributeRepository} from '../providers/repository/element-type-config-attributes';





@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    LoginPage,
    CasesPage,
    PendientesComponent,
    TerminadosComponent,
    ProjectPage,
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
    CasesPage,
    ProjectPage,
    PendientesComponent,
    TerminadosComponent,
    Upload,
    UploadList
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    Camera,
    Geolocation,
    Storage,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DbManagerProvider,
    LoginProvider,
    StorageProvider,
    ListaDeseosService,
    UserAreaRepository,
    ProjectProvider,
    ProjectSubprojectRepository,
    CasesRepository,
    ElementTypeConfigAttributeRepository,
    CasesProvider,
    WorkitemFlowProvider,
    WorkItemElementRepository
  ]
})
export class AppModule {}
