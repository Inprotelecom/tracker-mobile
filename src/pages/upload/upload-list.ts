import { Component, OnInit } from '@angular/core';
import {NavController,ModalController} from 'ionic-angular';
import {Upload} from '../upload/upload';
import {ViewController} from "ionic-angular";
import {LoginPage} from '../login/login';
@Component({
  selector: 'page-upload-list',
  templateUrl: 'upload-list.html',
})
export class UploadList implements OnInit {
    constructor(private modalCtrl:ModalController,
              private viewCtrl:ViewController,
              private navCtrl:NavController) {

   }

   goToLogin(){
     this.navCtrl.setRoot(LoginPage,{},{animate:true,direction:'forward'})
   }

  ngOnInit() {}

  showUploadModal(){

    let modal=this.modalCtrl.create(Upload);
    modal.present();

  }

}
