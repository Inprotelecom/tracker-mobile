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
                        }else{
                          this.items=null;
                        }

                        resolve();
                      })
        })
      }else{
        if(localStorage.getItem(key)){
          this.items=JSON.parse(localStorage.getItem(key));

        }else{
          this.items=null;
        }

        resolve();
      }
    });

    return promise;

  }

  public storageGet(key: string, Default: any): any {
    if(this.platform.is("cordova")){
        this.storage.get(key).then((data) => {
            console.log("UserOptionsService<<------------Storage.get ", key, data);
            return (data);
        })
            .catch(() => {
                console.log("UserOptionsService------------>>Load DEFAULTS", Default);
                return Default;
            });
    }else{
      if(localStorage.getItem(key)){
        return JSON.parse(localStorage.getItem(key));

      }else{
          return Default;
      }
    }
  }

  public removeStorage(key: string): any {
    if(this.platform.is("cordova")){
          this.storage.ready().then(
              () => {
                  this.storage.remove(key);
          });
    }else{
      localStorage.removeItem(key)
    }
  }

}
