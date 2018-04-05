import { Injectable } from '@angular/core';
import { Storage} from '@ionic/storage';
import { Platform} from "ionic-angular";

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
    return new Promise((solve,reject)=>{
      if(this.platform.is("cordova")){
          this.storage.get(key).then((data) => {
              if(data!=null){
                console.log("UserOptionsService<<------------Storage.get -"+data, key, data);

                solve(data);
              }else{
                console.log("UserOptionsService------------>>Load DEFAULTS", Default);
                solve(Default);
              }
          })
              .catch(() => {
                  console.log("UserOptionsService------------>>Load DEFAULTS", Default);
                  solve(Default);
              });
      }else{
        if(localStorage.getItem(key)){
          solve(JSON.parse(localStorage.getItem(key)));

        }else{
            solve(Default);
        }
      }
    })

  }

      public removeStorage(key: string): any {
        if(this.platform.is("cordova")){
              this.storage.ready().then(
                  () => {
                      this.storage.remove(key);
                      console.log("removing key:"+key);
              });
        }else{
          localStorage.removeItem(key)
        }
  }

}
