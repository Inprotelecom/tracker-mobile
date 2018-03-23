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

  constructor(public http: Http,
              private alertCrtl:AlertController,
              private projectSubprojectRepository:ProjectSubprojectRepository) {
    console.log('Hello ProjectProvider Provider');
  }

  public getAllLocalProjectSubProject(){

  }

  public getAllRemoteProjectSubProject(){
    let url=URL_TRACKER_SERVICE+PROJECT_SUBPROJECT;
    let data=new URLSearchParams();
    data.append("area","");

    return this.http.get(url)
                    .map(resp=> {
                    let data_resp= resp.json();
                    if(data_resp.code!=0){
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
                          this.projectSubprojectRepository.insert(projectSubproject);
                        })

                      } else {
                            this.alertCrtl.create({
                            title:data_resp.message,
                            subTitle:data_resp.message,
                            buttons:["OK"]
                            }).present();

                    }

                    }).catch((error:any) => {
                          console.log(error.status);
                          this.alertCrtl.create({
                          title:"Connection Error",
                          subTitle:"Connection Error",
                          buttons:["OK"]
                          }).present();
                                return Observable.throw(error);
                      });


  }

}
