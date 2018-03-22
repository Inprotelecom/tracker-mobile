import { Component } from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';
import { LoginProvider} from '../../providers/login/login';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username:string="";
  password:string="";
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl:ViewController,
              private loginService:LoginProvider) {
  }


  login(){
    this.loginService.login(this.username,this.password).subscribe(()=>{

    });
  }

}
