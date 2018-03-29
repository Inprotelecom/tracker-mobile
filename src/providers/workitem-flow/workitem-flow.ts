import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { CORDOVA} from '../../config/app-constants';
import { URL_TRACKER_SERVICE,WORKITEMS_FLOW} from '../../config/url.services';
import { Cases} from '../../app/clases/entities/cases';
import { WorkItemElementRepository} from '../repository/workitem-element';
import { ElementTypeConfigAttributeRepository} from '../repository/element-type-config-attributes';
import { WorkitemElement} from '../../app/clases/entities/workitem-element';
import { ElementTypeConfigAttribute} from '../../app/clases/entities/element-type-config-attributes';

@Injectable()
export class WorkitemFlowProvider {

  workitemflow:WorkitemElement[]=[];
  etypeList:ElementTypeConfigAttribute[]=[];
  constructor(private http: Http,
              private platform:Platform,
              private workItemElementRepository:WorkItemElementRepository,
              private elementTypeConfigAttributeRepository:ElementTypeConfigAttributeRepository) {

  }

  public shareCases(cases:Cases,areaId:number){
    this.workitemflow=[];
    let isCorrect=false;
    let correct:boolean []=[];
    let url=URL_TRACKER_SERVICE+WORKITEMS_FLOW+"?elementId="+cases.elementId
        +"&caseId="+cases.caseId+"&areaId="+areaId;
        return new Promise((resolve,reject)=>{
                      this.http.get(url).subscribe(resp=>{
                        let data_resp= resp.json();
                        if(data_resp!=null){
                        Promise.all([this.processEtypeConfig(data_resp.elementTypeConfigAttribute),this.processWiElement(data_resp.workFlow)])
                                .then(resolvedData => {
                                    console.log("Resolved data:"+resolvedData);
                                    resolve(resolvedData);

                            }).catch((error)=>{
                              console.log("Error processing all promises:"+error);
                              reject(error);
                            });


                        }

                        },(error) => {
                            console.log(error.status);
                          reject(error);
                  })
            })

  }



  private processWiElement(list:any){
return new Promise((resolve,reject)=>{
    list.forEach(data=>{
      let wi=new WorkitemElement();
      console.log("WIElement:"+JSON.stringify(data));
      wi.caseId=data.caseId;
      wi.elementId=data.elementId;
      wi.elementTypeConfigId=data.elementTypeConfigId;
      wi.notes=data.notes;
      wi.order=data.order;
      wi.parent=data.parent;
      wi.sequencial=data.sequencial;
      wi.workItemStatus=data.workItemStatus;
      wi.workItemStatusId=data.workItemStatusId;
      wi.workitemElementId=data.workitemElementId;
      wi.workitemTemplate=data.workitemTemplate;
      wi.workitemTemplateId=data.workitemTemplateId;
      this.workitemflow.push(wi);
        if(this.platform.is(CORDOVA)){
        this.workItemElementRepository.insert(wi);
        }
      })
      resolve(true);
    });
  }

  private processEtypeConfig(list:any):Promise<boolean>{
    let response:boolean=true;
    let listPromises:Promise<boolean>[]=[];
    return new Promise((resolve,reject)=>{
    for(var i =0; i< list.length;i++){
      console.log("Etype: "+JSON.stringify(list[i]));
      let etype=new ElementTypeConfigAttribute();
      etype.attributeId=list[i].caseId;
      etype.attributeTypeId=list[i].elementId;
      etype.comboCategoryId=list[i].elementTypeConfigId;
      etype.elementTypeConfigId=list[i].notes;
      etype.mandatory=list[i].order;
      this.etypeList.push(etype);
      if(this.platform.is(CORDOVA)){

        listPromises.push(this.elementTypeConfigAttributeRepository.insert(etype));
      }


  }

    if(this.platform.is(CORDOVA)){
      Promise.all(listPromises)
            .then(resolvedData => {
                console.log("Resolved data:"+resolvedData);
                resolve(resolvedData.filter(resp=>!resp).length==0);
          console.log("Resolve value"+response)
          resolve(response);
        });
    }


  })

}

}
