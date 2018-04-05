import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,ViewController } from 'ionic-angular';
import { CasesProvider} from '../../providers/cases/cases';
import { Cases } from '../../app/clases/entities/cases';
import { ProjectSubproject } from '../../app/clases/entities/project-subproject';
import { WorkitemPage} from '../workitem/workitem';
import * as _ from "lodash";


@Component({
  selector: 'page-cases-local',
  templateUrl: 'cases-local.html',
})
export class CasesLocalPage {

  projectSubproject:ProjectSubproject;
  cases:Cases[]=[];
  casesResp:Cases[]=[];
  constructor(public navCtrl: NavController,
              private modalCtrl:ModalController,
              private viewCtrl:ViewController,
              public navParams: NavParams,
              private casesProvider:CasesProvider) {

          this.projectSubproject=this.navParams.get("project");

  }

  ionViewWillEnter(){
    this.getLocalCases();
  }

  getLocalCases(){
    this.casesProvider.findSharedCasesByElement(this.projectSubproject.subprojectElementId)
        .subscribe(resp=>{
          this.casesResp=resp;
          this.cases=_.cloneDeep(this.casesResp);
        },e=>{
          this.casesResp=[];
          this.cases=[];
        });
  }

  filterElements(ev: any) {
      // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.cases = this.casesResp.filter((item) => {
        return (item.number.toLowerCase().
        indexOf(val.toLowerCase()) > -1);
      })
    }else{
      this.cases=_.cloneDeep(this.casesResp);
    }
  }


  onCaseSelect(cases:Cases){
      console.log("Selected Item", JSON.stringify(cases));
      this.navCtrl.push(WorkitemPage,{cases:cases});
  }

   dismiss() {
     this.viewCtrl.dismiss();
   }

}
