import { Component,Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {WiElementAttachment} from "../../app/clases/entities/wi-element-attachment";

@Component({
  selector: 'page-local-files',
  templateUrl: 'local-files.html',
})
export class LocalFilesPage {
@Input('wiElementAttachmentInput') wiElementAttachment;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log('wiElementAttachment:'+JSON.stringify(this.wiElementAttachment));
  }

}
