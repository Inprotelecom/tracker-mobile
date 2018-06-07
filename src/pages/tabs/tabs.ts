import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { LoginProvider} from '../../providers/login/login';
import { ProjectLocalPage } from '../project-local/project-local';
import { ProjectPage } from '../project/project';
import { CatalogsPage } from '../catalogs/catalogs';
import {WorkitemFilesPage} from "../workitem/workitem-files";
import {WorkitemImagesPage} from "../workitem/workitem-images";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProjectPage;
  tab2Root = ProjectLocalPage;
  tab3Root = WorkitemFilesPage;

  constructor(private navCtrl:NavController,
              private loginService:LoginProvider) {
  }

  closeSession(){
    this.loginService.closeSession();
    this.navCtrl.setRoot(LoginPage);
    
  }
}
