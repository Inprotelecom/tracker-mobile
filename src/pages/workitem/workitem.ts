import { Component,OnInit } from '@angular/core';
import {NavController, NavParams, ModalController, LoadingController} from 'ionic-angular';
import { ItemSliding } from 'ionic-angular';
import { WorkitemProvider} from '../../providers/workitem/workitem';
import { Cases} from '../../app/clases/entities/cases';
import { WorkitemElement} from '../../app/clases/entities/workitem-element';
import { WorkitemEditPage} from '../../pages/workitem/workitem-edit';
import * as _ from "lodash";
import {WorkitemFilesPage} from "./workitem-files";

@Component({
  selector: 'page-workitem',
  templateUrl: 'workitem.html',
})
export class WorkitemPage implements OnInit{

  workItemList:WorkitemElement[]=[];
  workItemListResp:WorkitemElement[]=[];
  cases:Cases;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl:ModalController,
              private workitemProvider:WorkitemProvider,
              public loadingCtrl: LoadingController) {

              this.cases=this.navParams.get("cases");
  }

  loading = this.loadingCtrl.create({
    content: 'Loading ...'
  });

  ngOnInit(){
     this.findAllWorkitems();
  }

  findAllWorkitems(){
    this.loading.present();
    this.workitemProvider.findWorkitemByCaseId(this.cases.caseId)
        .subscribe(resp=>{
          this.workItemListResp=resp;
          this.workItemList=_.cloneDeep(this.workItemListResp);
          this.loading.dismiss();
        },e=>{
          console.error(e);
          this.workItemListResp=[];
          this.workItemList==[];
          this.loading.dismiss();
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

onWiEdit(workitem:WorkitemElement,idx:number){
  console.log("Selected Item", JSON.stringify(workitem));
  let modal=this.modalCtrl.create(WorkitemEditPage,{workitem:workitem});
  modal.present();

}

onWiImages(slidingItem:ItemSliding,workitem:WorkitemElement,idx:number) {
  console.log("Selected Item", JSON.stringify(workitem));
  slidingItem.close();
  let modal = this.navCtrl.push(WorkitemFilesPage, {workitem: workitem});

}

}
