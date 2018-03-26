import { Component } from '@angular/core';
import { NavController, NavParams,ViewController} from 'ionic-angular';
import { ProjectSubproject} from '../../app/clases/entities/project-subproject';
import { CasesProvider} from '../../providers/cases/cases';
import { Cases } from '../../app/clases/entities/cases';
import { ItemSliding } from 'ionic-angular';

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


  getRemoteCases(refresher){

    setTimeout(() => {
      this.casesService.getAllRemoteProjectSubProject(this.projectSubproject.subprojectId)
          .then(list=>{
            this.cases=list;
            this.casesResp=list;
            refresher.complete();
          }).catch(error=>{
            console.error( error );
            this.cases=[];
            this.casesResp=[];
            refresher.complete();
      })

    }, 500);



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

share(slidingItem:ItemSliding,cases:Cases){
  slidingItem.close();
}

delete(slidingItem:ItemSliding,cases:Cases){
  slidingItem.close();
}

 dismiss() {
   this.viewCtrl.dismiss();
 }

}
