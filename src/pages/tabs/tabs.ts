import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController} from 'ionic-angular';

import { UploadList } from '../upload/upload-list';
import { PendientesComponent } from '../pendientes/pendientes.component';
import { TerminadosComponent } from '../terminados/terminados.component';
import { LoginPage } from '../login/login';
import { LoginProvider} from '../../providers/login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = UploadList;
  tab2Root = TerminadosComponent;
  tab3Root = LoginPage;

  constructor(private navCtrl:NavController,
              private loginService:LoginProvider) {

  }

  closeSession(){
    this.loginService.closeSession();
    this.navCtrl.setRoot(LoginPage,{},{animate:true,direction:'forward'})
  }
}
