import {Observable} from 'rxjs';
import { Component,OnInit } from '@angular/core';
import {
  NavController, NavParams, ViewController, AlertController, ToastController,
  LoadingController
} from 'ionic-angular';
import { ProjectSubproject} from '../../app/clases/entities/project-subproject';
import { CasesProvider} from '../../providers/cases/cases';
import { FilesProvider} from '../../providers/files/files';
import { WorkitemFlowProvider} from '../../providers/workitem-flow/workitem-flow';
import { Cases } from '../../app/clases/entities/cases';
import { ItemSliding } from 'ionic-angular';
import { Subject } from 'rxjs';
import { StorageProvider } from '../../providers/storage/storage';



@Component({
  selector: 'page-cases',
  templateUrl: 'cases.html',
})
export class CasesPage implements OnInit {

  private itemSlidingSubject=new Subject();
  itemSlidingSubject$=this.itemSlidingSubject.asObservable;
  areaId:number;
  projectSubproject:ProjectSubproject;
  cases:Cases[]=[];
  casesResp:Cases[]=[];
  loading = this.loadingCtrl.create({
    content: 'Please wait...'
  });

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl:ViewController,
              private casesService:CasesProvider,
              private workitemFlowProvider:WorkitemFlowProvider,
              private filesProvider:FilesProvider,
              private alertCrtl:AlertController,
              private toastCtrl:ToastController,
              private loadingCtrl:LoadingController,
              private storageService:StorageProvider) {

        this.projectSubproject=this.navParams.get("project");
        this.storageService.storageGet("areaId",0)
            .then(resp=>{
              this.areaId=resp;
            },error=>{
              this.areaId=0;
              console.log("CasesLocalPage",error);
            })
        this.getLocalCases();
  }

  ngOnInit() {


  }

  showMessage(message:string) {
  let toast = this.toastCtrl.create({
    message: message,
    duration: 2000,
  });
  toast.present();
}


  getRemoteCases(refresher){

    setTimeout(() => {
      this.casesService.getAllRemoteProjectSubProject(this.projectSubproject.subprojectId)
          .subscribe(list=>{
            this.cases=list;
            this.casesResp=list;
            refresher.complete();


          },error=>{
            console.error( error );
            this.cases=[];
            this.casesResp=[];
            refresher.complete();
            this.alertCrtl.create({
            title:"Connection Error",
            subTitle:"Connection Error",
            buttons:["OK"]
            }).present();
          });

    }, 500);



  }

  getLocalCases(){
    this.casesService.getAllLocalProjectSubProject(this.projectSubproject.subprojectElementId)
        .then(list=> {
          //console.info("Local find cases:"+JSON.stringify(list));
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

share(slidingItem:ItemSliding,cases:Cases,idx:number){
  this.loading.present();
  console.log("item sliding:"+JSON.stringify(cases));

   Observable.concat(this.workitemFlowProvider.shareCases(cases,this.areaId),
      this.filesProvider.saveWiElementDocStructureByCases(cases))
      .subscribe((resp:any)=>{
          console.info("Sharing response:",JSON.stringify(resp));
        if(typeof resp === 'boolean'){
            console.info("Sharing response boolean");
        }else{
          if(resp[0]){
              this.showMessage("Succesfull share");
          }else{
            this.showMessage("Error trying to share");
          }
          this.cases.splice(idx,1,resp[1]);
          slidingItem.close();
          this.loading.dismiss();
        }

        //let hasError:any=resp.filter(v=>!v);

    },err=>{
      this.showMessage("Error trying to share");
        slidingItem.close();
        this.loading.dismiss();
        console.error("ShareCases",JSON.stringify(err));
    });





  /*  this.workitemFlowProvider.shareCases(cases,this.areaId).subscribe((resp:any)=>{
      console.log("Sharing response:"+JSON.stringify(resp));
      if(resp[0]){
          this.showMessage("Succesfull share");
      }else{
        this.showMessage("Error trying to share");
      }
      this.cases.splice(idx,1,resp[1]);
      slidingItem.close();
      this.loading.dismiss();
  },err=>{
    this.showMessage("Error trying to share");
      slidingItem.close();
      this.loading.dismiss();
  });*/
}


delete(slidingItem:ItemSliding,cases:Cases,idx:number){
  this.loading.present();
  console.log("item sliding:"+JSON.stringify(cases));
    this.workitemFlowProvider.deleteCases(cases).subscribe((resp:any)=>{

    console.log("Delete case response:"+JSON.stringify(resp));
      //let hasError:any=resp.filter(v=>!v);
      if(resp[0]){
        this.showMessage("Case items has been successfully removed");
      }else{
        this.showMessage("Error trying to delete");
      }
      this.cases.splice(idx,1,resp[1]);
      slidingItem.close();
      this.loading.dismiss();
  },err=>{
      this.showMessage("Error trying to delete");
      slidingItem.close();
      this.loading.dismiss();
  });
}

 dismiss() {
   this.viewCtrl.dismiss();
 }

}
