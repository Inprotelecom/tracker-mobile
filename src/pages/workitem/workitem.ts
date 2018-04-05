import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
import { ItemSliding } from 'ionic-angular';
import { WorkitemProvider} from '../../providers/workitem/workitem';
import { Cases} from '../../app/clases/entities/cases';
import { WorkitemElement} from '../../app/clases/entities/workitem-element';
import { WorkitemEditPage} from '../../pages/workitem/workitem-edit';
import { WorkitemImagesPage} from '../../pages/workitem/workitem-images';
import * as _ from "lodash";

@Component({
  selector: 'page-workitem',
  templateUrl: 'workitem.html',
})
export class WorkitemPage {

  workItemList:WorkitemElement[]=[];
  workItemListResp:WorkitemElement[]=[];
  cases:Cases;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl:ModalController,
              private workitemProvider:WorkitemProvider) {

              this.cases=this.navParams.get("cases");
  }

  ionViewWillEnter(){
    this.findAllWorkitems();
  }

  findAllWorkitems(){
    this.workitemProvider.findWorkitemByCaseId(this.cases.caseId)
        .subscribe(resp=>{
          this.workItemListResp=resp;
          this.workItemList=_.cloneDeep(this.workItemListResp);
        },e=>{
          console.error(e);
          this.workItemListResp=[];
          this.workItemList==[];
        })
  }

  filterElements(ev: any) {
    // set val to the value of the searchbar
  let val = ev.target.value;

  // if the value is an empty string don't filter the items
  if (val && val.trim() != '') {
    this.workItemList = this.workItemListResp.filter((item) => {
      return (item.workitemTemplate.toLowerCase().
      indexOf(val.toLowerCase()) > -1);
    })
  }else{
    this.workItemList=_.cloneDeep(this.workItemListResp);
  }
}

onWiEdit(slidingItem:ItemSliding,workitem:WorkitemElement,idx:number){
  console.log("Selected Item", JSON.stringify(workitem));
  let modal=this.modalCtrl.create(WorkitemEditPage,{workitem:workitem});
  modal.present();
}

onWiImages(slidingItem:ItemSliding,workitem:WorkitemElement,idx:number){
  console.log("Selected Item", JSON.stringify(workitem));
  let modal=this.modalCtrl.create(WorkitemImagesPage,{workitem:workitem});
  modal.present();
}

}
