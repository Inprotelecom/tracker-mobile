import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { UserArea } from '../../app/clases/entities/user-area';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DB_CONFIG} from '../../config/app-constants';
import { UNIQUE_CONSTRAINT_FAILED_CODE} from '../../config/sqlite-error-constants';

@Injectable()
export class UserAreaRepository {

  public sqlite: SQLite;
  db: SQLiteObject = null;
  constructor(private platform:Platform) {

  }

  public insert(user: UserArea){
       this.platform.ready().then(() => {
                this.sqlite = new SQLite();
                this.sqlite.create(DB_CONFIG).then((db) => {
                  let sql = 'INSERT INTO USER_AREA(ID_USER,ID_AREA, NAME_AREA) VALUES(?,?,?)';
                  return db.executeSql(sql, [user.userId,user.areaId, user.areaName]);
                    }, (error) => {
                        console.info("Unable to execute sql " + JSON.stringify(error));
                    })
             }, (err) => {
                    console.info("Error opening database: " + err);
            });

    }

  public findByUser(userId:number){
     let resList:UserArea []=[];
        return new Promise((resolve,reject)=>{
          this.platform.ready().then(()=>{
              this.sqlite = new SQLite();
              this.sqlite.create(DB_CONFIG).then((db) => {
                let sql="SELECT ID_USER,ID_AREA,NAME_AREA FROM USER_AREA WHERE ID_USER=?";
                db.executeSql(sql,{}).then(res=>{
                  for(var i =0; i< res.rows.length;i++){
                    let row=new UserArea(res.row.item(i).ID_USER,res.row.item(i).ID_AREA,res.row.item(i).NAME_AREA);
                    resList.push(row);
                  }

                  resolve(resList);
                })

            }, (error) => {
                console.info("Unable to execute sql " + JSON.stringify(error));
                reject(error)
            })
          },(err)=>{
              console.info("Error opening database: " + err);
              reject(err)
          })
    })
  }

   public update(user: UserArea){
        let sql = 'UPDATE USER_AREA SET NAME_AREA=? WHERE ID=?';
        return this.db.executeSql(sql, [user.areaName,user.areaId]);
   }


}
