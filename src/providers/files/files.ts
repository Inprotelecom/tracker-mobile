import { HttpClient,HttpParams } from '@angular/common/http';
import {Platform} from 'ionic-angular';
import {CORDOVA} from '../../config/app-constants';
import { Injectable } from '@angular/core';
import {Cases} from '../../app/clases/entities/cases';
import {WorkitemElement} from '../../app/clases/entities/workitem-element';
import {WiElementAttachmentRepository} from "../repository/wi-element-attachment";
import {WiElementDocStructureRepository} from "../repository/wi-element-doc-structure";
import {WorkItemElementRepository} from "../repository/workitem-element";
import {WiElementAttachment} from "../../app/clases/entities/wi-element-attachment";
import {WorkItemElementDocStructure} from "../../app/clases/entities/wi-element-doc-structure";
import {Observable} from "rxjs/Observable";
import {ETYPE_CONFIG_DOCS, URL_TRACKER_SERVICE} from "../../config/url.services";

@Injectable()
export class FilesProvider {

  constructor(public http: HttpClient,
              private wiElementAttachmentRepository:WiElementAttachmentRepository,
              private wiElementDocStructureRepository:WiElementDocStructureRepository,
              private workItemElementRepository:WorkItemElementRepository,
              private platform:Platform) {
  }


  saveWiElementAttachment(wiElementAttachment:WiElementAttachment):Observable<Boolean>{
    return this.wiElementAttachmentRepository.insert(wiElementAttachment);
  }

  findWiElementDocStructureByWiElementAndElemenTypeConfig(wiElement:number,elementTypeConfig:number):Observable<WorkItemElementDocStructure>{
    return this.wiElementDocStructureRepository.findByWiElementAndElementTypeConfig(wiElement,elementTypeConfig);
  }

  saveWiElementDocStructureByCases(cases:Cases):Observable<boolean>{
    let listObservables: Observable<any>[] = [];
    return this.workItemElementRepository.findWiByCaseId(cases.caseId)
        .flatMap((resp:any)=>{
          //console.log("doc synf"+JSON.stringify(resp));
          resp.forEach(w=>{
            listObservables.push(this.findElementTypeConfigDocumentsStructure(
              w.workitemElementId,w.elementTypeConfigId));
          })
        if(this.platform.is(CORDOVA) && listObservables.length > 0){
            return Observable.forkJoin(listObservables).map(resp => {
                return resp.filter(r => !r).length > 0 == false;
                  })
          }else{
            return Observable.of('').map(resp => true);
          }
        });

  }

  saveWiElementDocStructureByWiElementAndElementTypeconfig(workItemElementId:number,elementTypeConfig:number):Observable<boolean>{
    return this.createGetResponse(URL_TRACKER_SERVICE+ETYPE_CONFIG_DOCS,
      new HttpParams().set('elementTypeConfigId',''+elementTypeConfig )
      .set('workItemElementId',''+workItemElementId))
      .flatMap((resp:any)=>{
        console.log('saveWiElementDocStructureByWiElementAndElementTypeconfig'+resp);
        let wiElementDocStructure=new WorkItemElementDocStructure();
        wiElementDocStructure.elementTypeConfigId=elementTypeConfig;
        wiElementDocStructure.workitemElementId=workItemElementId;
        wiElementDocStructure.structure=resp.structure;
        return this.wiElementDocStructureRepository.insert(wiElementDocStructure);
      })


  }

  private findElementTypeConfigDocumentsStructure(workitemElement:number,elementTypeConfig:number):Observable<any>{
    return this.createGetResponse(URL_TRACKER_SERVICE+ETYPE_CONFIG_DOCS,
      new HttpParams().set('elementTypeConfigId',''+elementTypeConfig )
      .set('workItemElementId',''+workitemElement))
      .flatMap((resp:any)=>{
        //console.log('Resp srvice WorkItemElementDocStructure'+JSON.stringify(resp));
        let wiElementDocStructure=new WorkItemElementDocStructure();
        wiElementDocStructure.elementTypeConfigId=elementTypeConfig;
        wiElementDocStructure.workitemElementId=workitemElement;
        wiElementDocStructure.structure=resp.structure;
        //console.log('WorkItemElementDocStructure-'+JSON.stringify(wiElementDocStructure));
         return Observable.forkJoin(this.wiElementDocStructureRepository.insert(wiElementDocStructure))
         .map(resp => {
            //console.log("resp forkjoin WorkItemElementDocStructure:" + JSON.stringify(resp));
            return true;
      })
    })
  }


  private createGetResponse(url:string,params:any):Observable<any>{
    return this.http.get(url,{params:params}).map((resp:any)=>{
      console.log('Response http'+JSON.stringify(resp))
      return resp;
    });
  }

}
