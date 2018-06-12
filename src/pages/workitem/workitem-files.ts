import { Observable } from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {TreeFolderComponent} from "../tree-folder/tree-folder";
import {NavController, NavParams, Platform, ToastController, ViewController,AlertController} from "ionic-angular";
import {WorkitemProvider} from "../../providers/workitem/workitem";
import {FilesProvider} from "../../providers/files/files";
import {WorkitemElement} from "../../app/clases/entities/workitem-element";
import {WorkItemElementDocStructure} from "../../app/clases/entities/wi-element-doc-structure";
import {CORDOVA} from "../../config/app-constants";
import {FilesSegmentEnum} from "../../app/enums/files_segment_enum";

@Component({
  selector: 'page-workitem-files',
  templateUrl: 'workitem-files.html',
})
export class WorkitemFilesPage implements OnInit{


  shownGroup: any;
  isLoggedIn: boolean = false;
  workItemElement:WorkitemElement;
  //workItemElementDocStructure:Observable<WorkItemElementDocStructure>;
  workItemElementDocStructure:WorkItemElementDocStructure;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private platform:Platform,
              private workitemProvider: WorkitemProvider,
              private filesProvider:FilesProvider,
              private toastCtrl: ToastController,
              private alertCrtl:AlertController,) {


    this.workItemElement = this.navParams.get("workitem");
    console.log("wi main:"+ this.workItemElement);
  }



  ngOnInit(){
    console.log('wokitem files');
    if(this.platform.is(CORDOVA)) {
      this.getDocumentsStructure();
    }
  }

  getRemoteFiles(refresher){

    setTimeout(() => {
      this.filesProvider.saveWiElementDocStructureByWiElementAndElementTypeconfig(
        this.workItemElement.workitemElementId,this.workItemElement.elementTypeConfigId)
          .subscribe(resp=>{
            if(resp){
              this.filesProvider
                          .findWiElementDocStructureByWiElementAndElemenTypeConfig(
                            this.workItemElement.workitemElementId,this.workItemElement.elementTypeConfigId)
                            .subscribe(r=>{
                              if(r==null){
                                this.pages=[];
                              }else{
                                this.workItemElementDocStructure=r;
                                this.pages=this.workItemElementDocStructure.structureObject;
                              }
                                  refresher.complete();
                            })
            }else{
                refresher.complete();
            }

          },error=>{
            console.error( error );
            refresher.complete();
            this.alertCrtl.create({
            title:"Connection Error",
            subTitle:"Connection Error",
            buttons:["OK"]
            }).present();
          });

    }, 500);



  }

  /*getDocumentsStructure(){
    this.workitemProvider.findElementTypeConfigDocumentsStructure(this.workItemElement)
      .subscribe((resp:any)=>{
        console.log('resp documents structure'+JSON.stringify(resp))
        this.pages=JSON.parse(resp.structure);
      },error=>{
        console.error('error resp documents structures:'+JSON.stringify(error))
      });
  }*/

  getDocumentsStructure(){
    console.log("Gettinng structure");
        this.filesProvider
                    .findWiElementDocStructureByWiElementAndElemenTypeConfig(
                      this.workItemElement.workitemElementId,this.workItemElement.elementTypeConfigId)
                      .subscribe(resp=>{
                        if(resp==null){
                          this.pages=[];
                        }else{
                          this.workItemElementDocStructure=resp;
                          this.pages=this.workItemElementDocStructure.structureObject;
                        }

                      },error=>{
                        console.log("Error structure:"+error);
                      })
  }

  pages = [];







}
