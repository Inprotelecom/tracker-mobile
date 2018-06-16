import {Component} from '@angular/core';
import {
  IonicPage, NavController, NavParams, ModalController, ViewController, ToastController,
  LoadingController,Platform
} from 'ionic-angular';
import {CasesProvider} from '../../providers/cases/cases';
import {Cases} from '../../app/clases/entities/cases';
import {ProjectSubproject} from '../../app/clases/entities/project-subproject';
import {WorkitemPage} from '../workitem/workitem';
import {ItemSliding} from 'ionic-angular';
import {SyncProvider} from '../../providers/sync/sync';
import { FilesProvider} from '../../providers/files/files';
import { WorkitemFlowProvider} from '../../providers/workitem-flow/workitem-flow';
import * as _ from "lodash";
import {Observable} from "rxjs/Observable";
import {CORDOVA} from "../../config/app-constants";
import { StorageProvider } from '../../providers/storage/storage';

@Component({
  selector: 'page-cases-local',
  templateUrl: 'cases-local.html',
})
export class CasesLocalPage {

  areaId:number;
  projectSubproject: ProjectSubproject;
  cases: Cases[] = [];
  casesResp: Cases[] = [];
  messageConf={
    content: 'Please wait...'
  }

  constructor(public navCtrl: NavController,
              private modalCtrl: ModalController,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private viewCtrl: ViewController,
              public navParams: NavParams,
              private casesProvider: CasesProvider,
              private syncProvider: SyncProvider,
              private platform:Platform,
              private workitemFlowProvider:WorkitemFlowProvider,
              private filesProvider:FilesProvider,
              private storageService:StorageProvider) {

    this.projectSubproject = this.navParams.get("project");
    this.storageService.storageGet("areaId",0)
        .then(resp=>{
          this.areaId=resp;
        },error=>{
          this.areaId=0;
          console.log("CasesLocalPage",error);
        })

  }

  ionViewWillEnter() {
    this.getCases();
  }

  showMessage(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  getCases(){
      if(this.platform.is(CORDOVA)){
          this.getLocalCases();
      }else{
          this.getRemoteCases();
      }
  }

  getLocalCases() {
    this.casesProvider.findSharedCasesByElement(this.projectSubproject.subprojectElementId)
      .subscribe(resp => {
        this.casesResp = resp;
        this.cases = _.cloneDeep(this.casesResp);
      }, e => {
        this.casesResp = [];
        this.cases = [];
      });
  }

  getRemoteCases(){

      this.casesProvider.getAllRemoteProjectSubProject(this.projectSubproject.subprojectId)
          .subscribe(list=>{
            this.casesResp=list;
            this.cases=_.cloneDeep(this.casesResp);;
          },error=>{
            console.error( error );
            this.cases=[];
            this.casesResp=[];
          });

  }

  filterElements(ev: any) {
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.cases = this.casesResp.filter((item) => {
        return (item.number.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.cases = _.cloneDeep(this.casesResp);
    }
  }


  onCaseSelect(cases: Cases) {
    console.log("Selected Item", JSON.stringify(cases));
    this.navCtrl.push(WorkitemPage, {cases: cases});
  }

  sync(slidingItem: ItemSliding, cases: Cases, idx: number) {
    let   loading = this.loadingCtrl.create();
    loading.present();
    console.log("Selected Item", JSON.stringify(cases));
    Observable.forkJoin(
      this.syncProvider.syncWiElementAttributeLocalToServer(cases.caseId),
      this.syncProvider.syncWiElementAttachmentToServer(cases.caseId))
      .subscribe(resp => {
        console.log("syncWiElementAttributeLocalToServer:" + resp);
        if (resp[0] != undefined && resp[1]) {
          this.showMessage("Succesfull sync");
        } else {
          this.showMessage("Error trying to sync");
        }
        this.updateCase(cases,loading,slidingItem);


      }, error => {
        this.showMessage("Error trying to sync");
        console.error("Error syncWiElementAttributeLocalToServer observable" + JSON.stringify(error));
        slidingItem.close();
        loading.dismiss();
      })
      //this.updateCase(cases,loading,slidingItem);

  }

  private updateCase(cases:Cases,loading:any,slidingItem:any){

     Observable.concat(this.workitemFlowProvider.shareCases(cases,this.areaId),
        this.filesProvider.saveWiElementDocStructureByCases(cases))
        .subscribe((resp:any)=>{
            console.info("Sharing response:",JSON.stringify(resp));
          if(typeof resp === 'boolean'){
              console.info("Sharing response boolean");
              loading.dismiss();
              slidingItem.close();
          }else{
            if(resp[0]){
                console.info("Succesfull share");
            }else{
              console.error("Error trying to share");
            }
        }
      },err=>{
          console.error("ShareCases",JSON.stringify(err));
            loading.dismiss();
            slidingItem.close();
      });
  }

}
