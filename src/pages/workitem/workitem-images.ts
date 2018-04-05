import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController} from 'ionic-angular';

@Component({
  selector: 'page-workitem-images',
  templateUrl: 'workitem-images.html',
})
export class WorkitemImagesPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl:ViewController) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
