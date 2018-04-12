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

@Injectable()
export class WorkitemProvider {
  webComponentTypeEnum=WebComponentType;

  constructor(private workItemElementRepository:WorkItemElementRepository,
              private wiElementAttributeRepository:WiElementAttributeRepository,
              private comboValueRepository:ComboValueRepository) {
  }

  findWorkitemByCaseId(caseId:number):Observable<WorkitemElement[]>{
    return this.workItemElementRepository.findWiByCaseId(caseId);
  }

  findWiElementAttributeByWiElement(elementId:number):Observable<WiElementAttribute[]>{
      return this.wiElementAttributeRepository.findWorkitemElementId(elementId)
         .flatMap((data:WiElementAttribute[])=>{
                  let comboValueObservables:Observable<WiElementAttribute>[]=[];
                  data
                 .filter(w=>w.attribute.comboCategoryId!=null)
                 .forEach(o=>{
                     comboValueObservables.push(this.comboValueRepository.findComboValuesToWiElementbyComboCategory(o));
                 });
                 return Observable.forkJoin(comboValueObservables).map(resp=>{
                      return data;
                 });
         })
  }

  findComboValueByComboCategory(comboCategoryId:number):Observable<ComboValue[]>{
     return this.comboValueRepository.findByComboCategoryId(comboCategoryId);
  }

  saveWiAttributes(wiElementAttributeList:WiElementAttribute[]){
    let wiAttributeObservable:Observable<Boolean>[]=[];
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

}
