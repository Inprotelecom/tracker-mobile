import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { HttpModule,Http,URLSearchParams} from '@angular/http';
import { Injectable } from '@angular/core';
import { ProjectSubproject} from '../../app/clases/entities/project-subproject';
import { URL_TRACKER_SERVICE,PROJECT_SUBPROJECT} from '../../config/url.services';
import { AlertController, Platform} from "ionic-angular";
import { ProjectSubprojectRepository} from '../repository/project-subproject';

@Injectable()
export class ProjectProvider {
  projectList:ProjectSubproject []=[];
  constructor(public http: Http,
              private platform:Platform,
              private alertCrtl:AlertController,
              private projectSubprojectRepository:ProjectSubprojectRepository) {
    console.log('Hello ProjectProvider Provider');
  }

  public getAllLocalProjectSubProject():any{
    return new Promise((resolve, reject)=>{
      if(this.platform.is('cordova')){

        this.projectSubprojectRepository.findAll().then(projects => {

          resolve( projects );
        }).catch( error => {
          console.error( error );
          reject(error);
        });

      }else{
        reject('No supported cordova');
      }

    })

  }

  public getAllRemoteProjectSubProject():any{

    let url=URL_TRACKER_SERVICE+PROJECT_SUBPROJECT;
    let data=new URLSearchParams();
    data.append("area","");

    return new Promise((resolve,reject) => {this.http.get(url)
                    .subscribe(resp=> {
                    let data_resp= resp.json();
                    if(data_resp!=null){
                        data_resp.forEach(data=>{
                          let projectSubproject=new ProjectSubproject();
                          projectSubproject.projectId=data.projectId;
                          projectSubproject.elementProjectId=data.elementProjectId;
                          projectSubproject.elementProjectStatusId=data.elementProjectStatusId;
                          projectSubproject.subprojectId=data.subprojectId;
                          projectSubproject.subprojectElementId=data.subprojectElementId;
                          projectSubproject.subprojectElementStatusId=data.subprojectElementStatusId;
                          projectSubproject.projectName=data.projectName;
                          projectSubproject.subprojectName=data.subprojectName;
                          this.projectList.push(projectSubproject);
                          if(this.platform.is("cordova")){

                            this.projectSubprojectRepository.insert(projectSubproject);
                          }
                        })
                          resolve( this.projectList );
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
                  }

}
