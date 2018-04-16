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

  saveWiAttributes(wiElementAttributeList:WiElementAttribute[],workItemElement:WorkitemElement){
    let wiAttributeObservable:Observable<Boolean>[]=[];
    wiAttributeObservable.push(this.workItemElementRepository.updateStatusAndNotes(workItemElement));
    wiElementAttributeList.forEach(item=>{
        item.synced=false;
        if(item.attribute.attributeTypeWebComponent==this.webComponentTypeEnum.CALENDAR && item.value!=''){
          console.log('Date from web:'+item.value);
          item.value=dateFormat(new Date(item.value),DT_FORMAT_WEB,true);
        }
        wiAttributeObservable.push(this.wiElementAttributeRepository.insert(item));
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
