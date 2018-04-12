import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { SAVE_WI_ATTRIBUTTES,URL_TRACKER_SERVICE} from '../../config/url.services';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { WiElementAttribute} from '../../app/clases/entities/wi-element-attribute';
import { WiElementAttributeRepository} from '../repository/wi-element-attribute';
import { WorkItemElementRepository} from '../repository/workitem-element';
import { StorageProvider} from '../storage/storage';
import { Platform } from 'ionic-angular';
import {Http,URLSearchParams} from "@angular/http";




@Injectable()
export class SyncProvider {

  constructor(public http: Http,
              private platform:Platform,
              private storageProvider:StorageProvider,
              private wiElementAttributeRepository:WiElementAttributeRepository,
              private workItemElementRepository:WorkItemElementRepository) {
  }

  public syncWiElementAttributeLocalToServer(caseId:number):Observable<any>{
    let params = new URLSearchParams();
    return Observable.forkJoin(this.workItemElementRepository.findWiByCaseId(caseId),
                        this.wiElementAttributeRepository.findWiAttributeByCaseIdAndSynced(caseId,false),
                        this.storageProvider.storageGet("userId",null))
                .flatMap(data=>{
                  params.append('wiElementAttributes', JSON.stringify(data[1]));
                  params.append('wiElement', JSON.stringify(data[0]));
                  params.append('user', JSON.stringify(data[2]));
                  console.log("params"+JSON.stringify(params));


                   return this.getPostResponse(URL_TRACKER_SERVICE+SAVE_WI_ATTRIBUTTES,params)
                        .flatMap(resp=>{
                          console.log("Http wi save:"+JSON.stringify(resp)+'-'+resp.wiElementAttribute.length);
                          if(resp.error==false && resp.wiElementAttribute.length>0) {
                            return this.processWiElementAttribute(resp.wiElementAttribute);
                          }else{
                            return Observable.of('').map(resp=>true);
                          }
                        });
              });

  }

  private getPostResponse(url:string,params:any):Observable<any>{
     return this.http.post(url,params).map((resp:any)=> resp.json());
  }

  private processWiElementAttribute(list:any):Observable<Boolean>{
    let listObservables:Observable<boolean>[]=[];
    list.forEach(data=>{
      console.log("wI attribute: "+JSON.stringify(data));
      let wiAttribute=new WiElementAttribute();
      wiAttribute.attributeId=data.attributeId;
      wiAttribute.value=data.value;
      wiAttribute.wiElementAttributeId=data.wiElementAttributeId;
      wiAttribute.workitemElementId=data.workitemElementId;
      wiAttribute.synced=true;
      listObservables.push(this.wiElementAttributeRepository.insert(wiAttribute));
    });
       return Observable.forkJoin(listObservables).map(resp=>{
            return resp.filter(r=>!r).length>0==false;
       });
     }



}
