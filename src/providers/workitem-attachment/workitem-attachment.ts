import { Http} from '@angular/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { WiElementAttachment} from '../../app/clases/entities/wi-element-attachment';
import { URL_TRACKER_SERVICE,REMOTE_WI_ELEMENT_ATTACHMENT} from '../../config/url.services';
@Injectable()
export class WorkitemAttachmentProvider {

  wiElementAttachment: WiElementAttachment[]=[];

  constructor(public http: Http) {

  }


public findRemoteWiElementAttachment(workItemElementId:number,etypeConfigDoc:number):Observable<WiElementAttachment[]>{
 let apiURL =`${URL_TRACKER_SERVICE}${REMOTE_WI_ELEMENT_ATTACHMENT}?workItemElementId=${workItemElementId}&etypeConfigDoc=${etypeConfigDoc}`;
  console.info('URL:'+apiURL);
  return this.http.get(apiURL)
      .map(resp=>{
        this.wiElementAttachment=[];
        if(resp.json()!=null){
          resp.json().forEach((d:any)=>{
           let wi=new WiElementAttachment();
               wi.comments=d.comments;
               wi.wiElementAttachmentId=d.wiElementAttachmentId;
               wi.filename=d.filename;
               wi.type=d.type;
               wi.isImage=d.isImage;
               wi.name=d.name;
               wi.order=d.order;
               this.wiElementAttachment.push(wi);
         });
        }
        return this.wiElementAttachment;
      });
}

}
