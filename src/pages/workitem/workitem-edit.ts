import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-workitem-edit',
  templateUrl: 'workitem-edit.html',
})
export class WorkitemEditPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl:ViewController) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
