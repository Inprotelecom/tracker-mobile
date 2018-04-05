import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/do';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Observable} from 'rxjs/Observable';
import { HttpModule,Http,URLSearchParams} from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_TRACKER_SERVICE,CASES} from '../../config/url.services';
import { AlertController, Platform} from "ionic-angular";
import { CasesRepository} from '../repository/cases';
import { Cases } from '../../app/clases/entities/cases';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CasesProvider {

  constructor(public http: Http,
              private platform:Platform,
              private alertCrtl:AlertController,
              private casesRepository:CasesRepository) {

  }

  public getAllLocalProjectSubProject(elementId:number):any{
  return new Promise((resolve, reject)=>{
    if(this.platform.is('cordova')){

      this.casesRepository.findByElement(elementId).then(cases => {
        resolve( cases );
      }).catch( error => {
        console.error( error );
        reject(error);
      });

    }else{
      reject('No supported cordova');
    }

  })

}

public getAllRemoteProjectSubProject(subprojectId:number):Observable<Cases[]>{
  let casesList:Cases[]=[];
  let url=URL_TRACKER_SERVICE+CASES+"?subprojectId="+subprojectId;

  return this.http.get(url)
                  .map(resp=> {
                  let data_resp= resp.json();
                  if(data_resp!=null){
                      data_resp.forEach(data=>{
                        let caseEntity= new Cases();
                        caseEntity.caseId=data.caseId;
                        caseEntity.caseStatusId=data.caseStatusId;
                        caseEntity.elementId=data.elementId;
                        caseEntity.elementTypeId=data.elementTypeId;
                        caseEntity.number=data.number;
                        casesList.push(caseEntity);

                        if(this.platform.is("cordova")){

                          this.casesRepository.insert(caseEntity);
                        }
                      })
                      return   casesList;
                    } else {
                          Observable.throw("Connection Error");

                  }

                },(error) => {
                        console.log(error.status);

                      Observable.throw("Connection Error");
                });


  }

  public findSharedCasesByElement(elementId:number):Observable<Cases []>{
     return this.casesRepository.findSharedCasesByElement(elementId);
  }

    /*public getAllRemoteProjectSubProject(subprojectId:number):any{
    let casesList:Cases[]=[];
    let url=URL_TRACKER_SERVICE+CASES+"?subprojectId="+subprojectId;
    return new Promise((resolve,reject) => {this.http.get(url)
                    .subscribe(resp=> {
                    let data_resp= resp.json();
                    if(data_resp!=null){
                        data_resp.forEach(data=>{
                          let caseEntity= new Cases();
                          caseEntity.caseId=data.caseId;
                          caseEntity.caseStatusId=data.caseStatusId;
                          caseEntity.elementId=data.elementId;
                          caseEntity.elementTypeId=data.elementTypeId;
                          caseEntity.number=data.number;
                          casesList.push(caseEntity);

                          if(this.platform.is("cordova")){

                            this.casesRepository.insert(caseEntity);
                          }
                        })
                          resolve( casesList );
                      } else {
                            this.alertCrtl.create({
                            title:data_resp.message,
                            subTitle:data_resp.message,
                            buttons:["OK"]
                            }).present();


                    }

                  },(error) => {
                          console.log(error.status);
                          this.alertCrtl.create({
                          title:"Connection Error",
                          subTitle:"Connection Error",
                          buttons:["OK"]
                          }).present();

                      });

                    })
    }*/



}
