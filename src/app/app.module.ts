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
import { ProjectLocalPage} from '../pages/project-local/project-local';
import { CatalogsPage} from '../pages/catalogs/catalogs';
import { CasesLocalPage} from '../pages/cases-local/cases-local';
import { WorkitemPage} from '../pages/workitem/workitem';
import { WorkitemEditPage} from '../pages/workitem/workitem-edit';
import { WorkitemImagesPage} from '../pages/workitem/workitem-images';
import {TreeFolderComponent} from "../pages/tree-folder/tree-folder";
import {WorkitemFilesPage} from "../pages/workitem/workitem-files";

//PipesModule

import {PipeComboValuePipe} from '../pipes/pipe-combo-value-pipe-ts/pipe-combo-value-pipe';

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
import { CasesProvider } from '../providers/cases/cases';
import { WorkitemFlowProvider } from '../providers/workitem-flow/workitem-flow';
import { ProjectLocalProvider } from '../providers/project-local/project-local';
import { WorkitemProvider } from '../providers/workitem/workitem';
import { SyncProvider } from '../providers/sync/sync';
import { FilesProvider } from '../providers/files/files';


//Repositories

import { UserAreaRepository} from '../providers/repository/user-area';
import { ProjectSubprojectRepository} from '../providers/repository/project-subproject';
import { CasesRepository} from '../providers/repository/cases';
import { WorkItemElementRepository } from '../providers/repository/workitem-element';
import { ElementTypeConfigAttributeRepository} from '../providers/repository/element-type-config-attributes';
import { AttributeRepository } from '../providers/repository/attribute';
import { ComboValueRepository} from '../providers/repository/combo-value';
import { WiElementAttributeRepository} from '../providers/repository/wi-element-attribute';
import {WorkItemStatusRepository} from "../providers/repository/workitem-status";
import {EtypeConfigWiStatusRepository} from "../providers/repository/etype-config-wi-status";
import {WiElementAttachmentRepository} from "../providers/repository/wi-element-attachment";

import {HttpClientModule} from "@angular/common/http";











@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    LoginPage,
    CasesPage,
    PendientesComponent,
    TerminadosComponent,
    ProjectPage,
    ProjectLocalPage,
    CatalogsPage,
    Upload,
    UploadList,
    CasesLocalPage,
    WorkitemPage,
    WorkitemEditPage,
    WorkitemImagesPage,
    PipeComboValuePipe,
    TreeFolderComponent,
    WorkitemFilesPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    HttpClientModule
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
    UploadList,
    ProjectLocalPage,
    CatalogsPage,
    CasesLocalPage,
    WorkitemPage,
    WorkitemEditPage,
    WorkitemImagesPage,
    TreeFolderComponent,
    WorkitemFilesPage
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
    WorkItemElementRepository,
    ProjectLocalProvider,
    WorkitemProvider,
    AttributeRepository,
    ComboValueRepository,
    WiElementAttributeRepository,
    WorkItemStatusRepository,
    EtypeConfigWiStatusRepository,
    SyncProvider,
    FilesProvider,
    WiElementAttachmentRepository,
  ]
})
export class AppModule {}
