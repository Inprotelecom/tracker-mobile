import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { WiElementAttribute} from '../../app/clases/entities/wi-element-attribute';
import { WorkitemElement} from '../../app/clases/entities/workitem-element';
import { Attribute} from '../../app/clases/entities/attribute';
import { WorkitemProvider} from '../../providers/workitem/workitem';
import { WebComponentType} from '../../app/enums/web-component-type';

@Component({
  selector: 'page-workitem-edit',
  templateUrl: 'workitem-edit.html',
})
export class WorkitemEditPage implements OnInit{
  wiAttributeList:WiElementAttribute[]=[];
  workItemElement:WorkitemElement;
  webComponentTypeEnum=WebComponentType;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl:ViewController,
              private workitemProvider:WorkitemProvider) {

          this.workItemElement=this.navParams.get("workitem");
  }

  ngOnInit(){
    this.getWiAttributtes();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getWiAttributtes(){
    this.workitemProvider.findWiElementAttributeByWiElement(this.workItemElement.workitemElementId)
        .subscribe(resp=>{
          console.log('data resp wiattribute:'+JSON.stringify(resp));
          this.wiAttributeList=resp;
        },e=>{
          this.wiAttributeList=[];
          console.error('Erro getting wiAttributes',e);
        })
  }

  

}
