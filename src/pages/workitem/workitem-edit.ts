import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,ToastController } from 'ionic-angular';
import { WiElementAttribute} from '../../app/clases/entities/wi-element-attribute';
import { WorkitemElement} from '../../app/clases/entities/workitem-element';
import { Attribute} from '../../app/clases/entities/attribute';
import { WorkitemProvider} from '../../providers/workitem/workitem';
import { WebComponentType} from '../../app/enums/web-component-type';
import * as _ from 'lodash';

@Component({
  selector: 'page-workitem-edit',
  templateUrl: 'workitem-edit.html',
})
export class WorkitemEditPage implements OnInit{
  wiAttributeList:WiElementAttribute[]=[];
  wiAttributeListResp:WiElementAttribute[]=[];
  workItemElement:WorkitemElement;
  webComponentTypeEnum=WebComponentType;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl:ViewController,
              private workitemProvider:WorkitemProvider,
              private toastCtrl:ToastController) {

          this.workItemElement=this.navParams.get("workitem");
  }

  ngOnInit(){
    this.getWiAttributtes();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  showMessage(message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  getWiAttributtes(){
    this.workitemProvider.findWiElementAttributeByWiElement(this.workItemElement.workitemElementId)
        .subscribe(resp=>{
          console.log('Wi Attributes search:'+JSON.stringify(resp));
          this.wiAttributeList=resp;
          this.wiAttributeListResp=_.cloneDeep(this.wiAttributeList);
        },e=>{
          this.wiAttributeList=[];
          this.wiAttributeListResp=[];
          console.error('Error getting wiAttributes',e);
        })
  }

  saveWiAttributes(){
    this.workitemProvider.saveWiAttributes(this.wiAttributeList)
        .subscribe(resp=>{
          if(resp.filter(item=>!item).length>0){
              this.showMessage("Error saving elements");
          }else{
              this.showMessage("Elements has been successfully saved");
          }
      });
  }



}
