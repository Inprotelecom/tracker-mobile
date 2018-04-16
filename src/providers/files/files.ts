import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {WiElementAttachmentRepository} from "../repository/wi-element-attachment";
import {WiElementAttachment} from "../../app/clases/entities/wi-element-attachment";
import {Observable} from "rxjs/Observable";

@Injectable()
export class FilesProvider {

  constructor(public http: HttpClient,
              private wiElementAttachmentRepository:WiElementAttachmentRepository) {
  }


  saveWiElementAttachment(wiElementAttachment:WiElementAttachment):Observable<Boolean>{
    return this.wiElementAttachmentRepository.insert(wiElementAttachment);
  }

}
