import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ViewController, ToastController} from 'ionic-angular';
import {WiElementAttribute} from '../../app/clases/entities/wi-element-attribute';
import {WorkitemElement} from '../../app/clases/entities/workitem-element';
import {WorkitemProvider} from '../../providers/workitem/workitem';
import {WebComponentType} from '../../app/enums/web-component-type';
import * as _ from 'lodash';
import dateFormat from 'dateformat';
import {DT_FORMAT_IONIC} from "../../config/app-constants";
import {Observable} from "rxjs/Observable";
import {EtypeConfigWiStatus} from "../../app/clases/entities/etype-config-wi-status";


@Component({
  selector: 'page-workitem-edit',
  templateUrl: 'workitem-edit.html',
})
export class WorkitemEditPage implements OnInit {
  wiAttributeList: WiElementAttribute[] = [];
  wiAttributeListResp: WiElementAttribute[] = [];
  workItemElement: WorkitemElement=new WorkitemElement();
  webComponentTypeEnum = WebComponentType;
  etypeWorkItemStatusList: EtypeConfigWiStatus[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private workitemProvider: WorkitemProvider,
              private toastCtrl: ToastController) {

    this.workItemElement = this.navParams.get("workitem");
  }

  ngOnInit() {
    /*this.workitemProvider.findWiElementById(this.workItemElement.workItemStatusId).subscribe(resp=>{
      this.workItemElement=resp;
    });*/
    this.getWiAttributtes();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  showMessage(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  getWiAttributtes() {


    Observable.forkJoin(
      this.workitemProvider.findWiElementAttributeByWiElement(this.workItemElement.workitemElementId),
      this.workitemProvider.findEtypeConfigWiStatusByElementTypeConfigId(this.workItemElement.elementTypeConfigId))
      .subscribe(resp => {
        console.info('Resp:'+ JSON.stringify(resp));
        this.wiAttributeList = _.cloneDeep(resp[0]);
        this.wiAttributeList.filter(o => o.attribute.attributeTypeWebComponent == this.webComponentTypeEnum.CALENDAR && o.value != null)
          .map(o => {
            let dateString: string [] = (o.value.slice(0, 10)).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
            let date = new Date(Number(dateString[3]), Number(dateString[2]) - 1, Number(dateString[1]));
            o.value = dateFormat(date, DT_FORMAT_IONIC, true);
          });
        this.wiAttributeListResp = _.cloneDeep(this.wiAttributeList);
        this.etypeWorkItemStatusList=_.cloneDeep(resp[1]);
        console.info('Resp:'+ resp[1]);


      }, e => {
        this.wiAttributeList = [];
        this.wiAttributeListResp = [];
        this.etypeWorkItemStatusList = [];
        console.error('Error getting wiAttributes'+e);
      })

  }


  saveWiAttributes() {
    this.workitemProvider.saveWiAttributes(this.wiAttributeList,this.workItemElement)
      .subscribe(resp => {
        if (resp.filter(item => !item).length > 0) {
          this.showMessage("Error saving elements");
        } else {
          this.showMessage("Elements has been successfully saved");
        }
      });
  }




}
