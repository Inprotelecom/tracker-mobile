import { Injectable } from '@angular/core';
import { Storage} from '@ionic/storage';
import { AlertController, Platform} from "ionic-angular";

@Injectable()
export class StorageProvider {
  items:any;

  constructor(private platform:Platform,
              private storage:Storage) {
    console.log('Hello StorageProvider Provider');
  }

  public saveStorage(key:string,object:Object){
    if(this.platform.is("cordova")){
        this.storage.set(key,object);
    }else{
        localStorage.setItem(key,JSON.stringify(object));
    }
  }

  public getStorage(key:string){
    let promise=new Promise((resolve,reject)=>{
      if(this.platform.is("cordova")){
        this.storage.ready().then(()=>{
            this.storage.get(key)
                      .then(items=>{
                        if(items){
                          this.items=items;
                        }

                        resolve();
                      })
        })
      }else{
        if(localStorage.getItem(key)){
          this.items=JSON.parse(localStorage.getItem(key));

        }

        resolve();
      }
    });

    return promise;

  }

}
