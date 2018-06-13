import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkitemElement} from '../../app/clases/entities/workitem-element';
import { WiElementAttribute} from '../../app/clases/entities/wi-element-attribute';
import { ComboValue} from '../../app/clases/entities/combo-value';
import { WorkItemElementRepository} from '../repository/workitem-element';
import { WiElementAttributeRepository} from '../repository/wi-element-attribute';
import { ComboValueRepository} from '../repository/combo-value';
import dateFormat from 'dateformat';
import {DT_FORMAT_WEB} from "../../config/app-constants";
import {WebComponentType} from "../../app/enums/web-component-type";
import {EtypeConfigWiStatusRepository} from "../repository/etype-config-wi-status";
import {EtypeConfigWiStatus} from "../../app/clases/entities/etype-config-wi-status";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ETYPE_CONFIG_DOCS, URL_TRACKER_SERVICE} from "../../config/url.services";
import * as _ from "lodash";

@Injectable()
export class WorkitemProvider {
  webComponentTypeEnum=WebComponentType;

  constructor(private workItemElementRepository:WorkItemElementRepository,
              private wiElementAttributeRepository:WiElementAttributeRepository,
              private comboValueRepository:ComboValueRepository,
              private etypeConfigWiStatusRepository:EtypeConfigWiStatusRepository,
              private http:HttpClient) {
  }

  findWorkitemByCaseId(caseId:number):Observable<WorkitemElement[]>{
    return this.workItemElementRepository.findWiByCaseId(caseId);
  }

  findWiElementAttributeByWiElement(elementId:number):Observable<WiElementAttribute[]>{
      return this.wiElementAttributeRepository.findWorkitemElementId(elementId)
         .flatMap((data:WiElementAttribute[])=>{
                  console.info('Resp seach wiAttributes'+JSON.stringify(data));
                  let comboValueObservables:Observable<WiElementAttribute>[]=[];
                  data
                 .filter(w=>w.attribute.comboCategoryId!=null)
                 .forEach(o=>{
                     comboValueObservables.push(this.comboValueRepository.findComboValuesToWiElementbyComboCategory(o));
                 });
                 return (comboValueObservables.length>0)
                   ?Observable.forkJoin(comboValueObservables).map(resp=> data)
                   :Observable.of('').map(resp=> data);
         })
  }

  findComboValueByComboCategory(comboCategoryId:number):Observable<ComboValue[]>{
     return this.comboValueRepository.findByComboCategoryId(comboCategoryId);
  }

  saveWiAttributes(wiAttributeListResp:WiElementAttribute[],
                   wiElementAttributeList:WiElementAttribute[],
                   workItemElementResp:WorkitemElement,
                   workItemElement:WorkitemElement){
    let wiAttributeObservable:Observable<Boolean>[]=[];


    /*console.log('Old Object- Status',workItemElementResp.workItemStatusId);
    console.log('New Object- Status'+workItemElement.workItemStatusId);
    console.log('Is Equal',_.isEqual(workItemElementResp.workItemStatusId, workItemElement.workItemStatusId));*/
    if(!_.isEqual(workItemElementResp.workItemStatusId, workItemElement.workItemStatusId)){
        console.log('Synced false');
        workItemElement.statusSynced=false;
        wiAttributeObservable.push(this.workItemElementRepository.updateStatus(workItemElement));
    }

    /*console.log('Old Object- Notes',workItemElementResp.notes);
    console.log('New Object- Notes'+workItemElement.notes);
    console.log('Is Equal',_.isEqual(workItemElementResp.notes, workItemElement.notes));*/
    if(!_.isEqual(workItemElementResp.notes, workItemElement.notes)){
        console.log('Synced false');
        workItemElement.notesSynced=false;
        wiAttributeObservable.push(this.workItemElementRepository.updateNotes(workItemElement));
    }

    wiElementAttributeList.forEach(item=>{
        let cloneItem=_.cloneDeep(item);
        let wiElementAttributeResp =_.find(wiAttributeListResp,{wiElementAttributeId:cloneItem.wiElementAttributeId});
        /*console.log('Old Object-'+wiElementAttributeResp.attribute.name,wiElementAttributeResp.value);
        console.log('New Object-'+cloneItem.attribute.name,cloneItem.value);
        console.log('Is Equal',_.isEqual(wiElementAttributeResp.value, cloneItem.value));*/
        if(!_.isEqual(wiElementAttributeResp.value, cloneItem.value)){
          cloneItem.synced=false;
          console.log('Synced false');
        }

        if(cloneItem.attribute.attributeTypeWebComponent==this.webComponentTypeEnum.CALENDAR && cloneItem.value!=null && cloneItem.value!=''){
          console.log('Date from web:'+cloneItem.value);
          cloneItem.value=dateFormat(new Date(cloneItem.value),DT_FORMAT_WEB,true);
        }


        wiAttributeObservable.push(this.wiElementAttributeRepository.insert(cloneItem));
    });
    return Observable.forkJoin(wiAttributeObservable);
  }

  findEtypeConfigWiStatusByElementTypeConfigId(elementTypeConfigId:number):Observable<EtypeConfigWiStatus[]>{
    return this.etypeConfigWiStatusRepository.findByElementTypeConfigId(elementTypeConfigId);
  }

  findWiElementById(id:number):Observable<WorkitemElement>{
    return this.workItemElementRepository.findWiElementById(id);
  }

  findElementTypeConfigDocumentsStructure(workitemElement:WorkitemElement){
    return this.createGetResponse(URL_TRACKER_SERVICE+ETYPE_CONFIG_DOCS,
      new HttpParams().set('elementTypeConfigId',''+workitemElement.elementTypeConfigId)
      .set('workItemElementId',''+workitemElement.workitemElementId));
  }

  private createGetResponse(url:string,params:any):Observable<any>{
    return this.http.get(url,{params:params});
  }




}
