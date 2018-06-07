import { Component, OnInit} from '@angular/core';
import { NavController, NavParams, ViewController, ModalController} from 'ionic-angular';
import { LoginProvider} from '../../providers/login/login';
import { TabsPage} from '../../pages/tabs/tabs'

import { DbManagerProvider } from '../../providers/db-manager/db-manager';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit{

  username:string="";
  password:string="";
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl:ViewController,
              private loginService:LoginProvider,
              private modalCtrl:ModalController,
              public dbManager:DbManagerProvider) {
  }
  ngOnInit() {
  }


  login(){
    this.loginService.login(this.username,this.password).subscribe(()=>{
        if(this.loginService.id_user!=null){
          //this.dbManager.removeDatabase();
          //this.dbManager.createDatabase();
          this.navCtrl.setRoot(TabsPage,{},{animate:true,direction:'forward'})
        }
    });
  }

}
