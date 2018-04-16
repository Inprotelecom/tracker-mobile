import {Component, OnInit} from '@angular/core';
import {TreeFolderComponent} from "../tree-folder/tree-folder";
import {NavController, NavParams, ToastController, ViewController} from "ionic-angular";
import {WorkitemProvider} from "../../providers/workitem/workitem";
import {WorkitemElement} from "../../app/clases/entities/workitem-element";

@Component({
  selector: 'page-workitem-files',
  templateUrl: 'workitem-files.html',
})
export class WorkitemFilesPage implements OnInit{

  shownGroup: any;
  isLoggedIn: boolean = false;
  workItemElement:WorkitemElement;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private workitemProvider: WorkitemProvider,
              private toastCtrl: ToastController) {


    this.workItemElement = this.navParams.get("workitem");
    console.log("wi main:"+ this.workItemElement);
  }

  ngOnInit(){
    console.log('wokitem files');
    this.getDocumentsStructure();
  }

  getDocumentsStructure(){
    this.workitemProvider.findElementTypeConfigDocumentsStructure(this.workItemElement)
      .subscribe((resp:any)=>{
        console.log('resp documents structure'+JSON.stringify(resp))
        this.pages=JSON.parse(resp.structure);
      },error=>{
        console.error('error resp documents structures:'+JSON.stringify(error))
      });
  }

  pages = [];







}
