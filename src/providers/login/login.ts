import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { StorageProvider } from '../storage/storage';
import { Http,URLSearchParams} from '@angular/http';
import { Injectable } from '@angular/core';
import { URL_TRACKER_SERVICE,LOGIN} from '../../config/url.services';
import { AlertController,Platform} from "ionic-angular";
import { UserAreaRepository} from "../repository/user-area";
import { UserArea} from '../../app/clases/entities/user-area';
import { DbManagerProvider} from '../../providers/db-manager/db-manager';
import { CORDOVA} from '../../config/app-constants';

@Injectable()
export class LoginProvider {

  token:string;
  id_user:number;

  constructor(public http: Http,
              private alertCrtl:AlertController,
              private storageService:StorageProvider,
              private userAreaRepository:UserAreaRepository,
              private dbManager:DbManagerProvider,
              private platform:Platform) {

  }

  login(username:string,password:string){

    this.dbManager.removeDatabase();
    this.dbManager.createDatabase();

    let data=new URLSearchParams();

    data.append("user",username);
    data.append("password",password);

    let url=URL_TRACKER_SERVICE+LOGIN;

      return this.http.post(url,data)
                      .timeout(3000)
                      .map( resp=>{
                      let data_resp=resp.json();
                      console.log("Login Resp:"+data_resp);

                      if(data_resp.code!=0){
                          this.id_user=data_resp.userid;
                          this.storageService.saveStorage("userId",this.id_user);
                          this.storageService.saveStorage("areaId",data_resp.area);
                          let userArea=new UserArea(data_resp.userid,data_resp.area,"");
                          this.userAreaRepository.insert(userArea);


                      }else{
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

    closeSession(){
      this.storageService.removeStorage("userId");
      this.id_user=null;
    }

    isLogged(){
      return new Promise((solve,reject)=>{
        this.storageService.storageGet("userId","")
              .then(res =>{
                    if(res!=""){
                        solve(true);
                    }else{
                        solve(false);
                      }
              }).catch( error => {
                  solve(false);

              })

      });

    }




}
