import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {SAVE_FILE, SAVE_WI_ATTRIBUTTES, URL_TRACKER_SERVICE} from '../../config/url.services';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { WiElementAttribute} from '../../app/clases/entities/wi-element-attribute';
import { WiElementAttributeRepository} from '../repository/wi-element-attribute';
import { WorkItemElementRepository} from '../repository/workitem-element';
import { StorageProvider} from '../storage/storage';
import { Platform } from 'ionic-angular';
import {Http,URLSearchParams} from "@angular/http";
import {WiElementAttachmentRepository} from "../repository/wi-element-attachment";
import {WiElementAttachment} from "../../app/clases/entities/wi-element-attachment";




@Injectable()
export class SyncProvider {


  constructor(public http: Http,
              private platform:Platform,
              private storageProvider:StorageProvider,
              private wiElementAttributeRepository:WiElementAttributeRepository,
              private workItemElementRepository:WorkItemElementRepository,
              private wiElementAttachmentRepository:WiElementAttachmentRepository) {
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


                   return this.syncWiAttributes(params);
              });

  }

  private syncWiAttributes(params:any):Observable<any>{
    return this.getPostResponse(URL_TRACKER_SERVICE+SAVE_WI_ATTRIBUTTES,params)
      .flatMap(resp=>{
        console.log("Http wi save:"+JSON.stringify(resp)+'-'+resp.wiElementAttribute.length);
        if(resp.error==false && resp.wiElementAttribute.length>0) {
          return this.processWiElementAttribute(resp.wiElementAttribute);
        }else{
          return Observable.of('').map(resp=>true);
        }
      });
  }


  public syncWiElementAttachmentToServer(caseId:number):Observable<any>{

    return Observable.forkJoin(this.wiElementAttachmentRepository.findWiElementAttachmentByNotSyncedByCaseId(caseId),
      this.storageProvider.storageGet("userId",null))
      .flatMap(data=>{
        return (data[0].length>0)?this.syncWiAttachment( data[0], data[1]):Observable.of('').map(resp=>true);
      });

  }


  private syncWiAttachment(wiAttachmentAttribute,userId):Observable<any>{
    let url=URL_TRACKER_SERVICE+SAVE_FILE;
    //console.info("syncWiAttachment" + JSON.stringify(url));
    let listObservables:Observable<boolean>[]=[];
    wiAttachmentAttribute.forEach((item:WiElementAttachment)=>{
      //console.info("params" + JSON.stringify(item));
      let params = new URLSearchParams();
      params.set('userId',userId);
      params.set('etypeConfigDocId',''+item.etypeConfigDocId);
      params.set('workitemElementId',''+item.workitemElementId);
      params.set('wiElementAttachmentId',''+item.wiElementAttachmentId);
      params.set('file',item.file);
      params.set('type',item.type);
      params.set('comment',item.comments);
      console.info("params" + JSON.stringify(params));
      listObservables.push(this.getWiAttachmentPostResponse(url,params));
    })


      return Observable.forkJoin(listObservables);
  }

  private getPostResponse(url:string,params:any):Observable<any>{
    return this.http.post(url,params).map((resp:any)=> resp.json());
  }

  private getWiAttachmentPostResponse(url:string,params:any):Observable<any>{
     return this.http.post(url,params).map((resp:any)=>{
       console.info('Server response attachment sync:'+JSON.stringify(resp))
       return resp.json();

     }).flatMap((data:any)=>{
       if(data.error){
         return Observable.of('').map(resp=>false);
       }else{
         console.log(JSON.stringify(data));
         return this.wiElementAttachmentRepository.updateSyncedAndWiElementAttachmentId(
           data.wiElementAttachmentRequest,
           data.wiElementAttachmentResponse,
           !data.error);
       }
     })
  }

  private processWiElementAttribute(list:any):Observable<Boolean>{
    let listObservables:Observable<boolean>[]=[];
    list.forEach(data=>{
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
