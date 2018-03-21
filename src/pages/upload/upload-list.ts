import { Component, OnInit } from '@angular/core';
import {NavController,ModalController} from 'ionic-angular';
import {Upload} from '../upload/upload';

@Component({
  selector: 'page-upload-list',
  templateUrl: 'upload-list.html',
})
export class UploadList implements OnInit {
  constructor(private modalCtrl:ModalController) {

   }

  ngOnInit() {}

  showUploadModal(){

    let modal=this.modalCtrl.create(Upload);
    modal.present();

  }

}
