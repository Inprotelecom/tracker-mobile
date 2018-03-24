import { Component } from '@angular/core';
import { NavController, NavParams,ViewController} from 'ionic-angular';
import { ProjectSubproject} from '../../app/clases/entities/project-subproject';
import { CasesProvider} from '../../providers/cases/cases';
import { Cases } from '../../app/clases/entities/cases';

@Component({
  selector: 'page-cases',
  templateUrl: 'cases.html',
})
export class CasesPage {

  projectSubproject:ProjectSubproject;
  cases:Cases[]=[];
  casesResp:Cases[]=[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl:ViewController,
              private casesService:CasesProvider) {

        this.projectSubproject=this.navParams.get("project");
        this.getLocalCases();
  }


  getRemoteCases(){
    this.casesService.getAllRemoteProjectSubProject(this.projectSubproject.subprojectId)
        .then(list=>{
          this.cases=list;
          this.casesResp=list;
        }).catch(error=>{
          console.error( error );
          this.cases=[];
          this.casesResp=[];
        })

  }

  getLocalCases(){
    this.casesService.getAllLocalProjectSubProject(this.projectSubproject.subprojectElementId)
        .then(list=> {
          this.cases=list;
          this.casesResp=list;
        }).catch(error=>{
          console.error( error );
          this.cases=[];
          this.casesResp=[];
        })
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
      this.cases=this.casesResp;
    }
  }


 dismiss() {
   this.viewCtrl.dismiss();
 }

}
