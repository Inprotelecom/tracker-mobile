import { StorageProvider } from '../storage/storage';
import { HttpModule,Http,URLSearchParams} from '@angular/http';
import { Injectable } from '@angular/core';
import { URL_TRACKER_SERVICE,LOGIN} from '../../config/url.services';
import { AlertController, Platform} from "ionic-angular";
import 'rxjs/add/operator/map';

@Injectable()
export class LoginProvider {

  token:string;
  id_user:number;

  constructor(public http: Http,
              private alertCrtl:AlertController,
              private storageService:StorageProvider) {
    console.log('Hello LoginProvider Provider');
  }

  login(username:string,password:string){

    let data=new URLSearchParams();

    data.append("user",username);
    data.append("password",password);

    let url=URL_TRACKER_SERVICE+LOGIN;

      return this.http.post(url,data)
                      .map( resp=>{
                      let data_resp=resp.json();
                      console.log("Login Resp:"+data_resp);

                      if(data_resp.code!=0){
                          this.id_user=data_resp.userid;
                          this.storageService.saveStorage("userId",this.id_user);
                      }else{
                          this.alertCrtl.create({
                          title:data_resp.message,
                          subTitle:data_resp.message,
                          buttons:["OK"]
                        }).present();

                      }

                      })
    }

    closeSession(){
      this.id_user=null;
      this.token=null;
    }




}
