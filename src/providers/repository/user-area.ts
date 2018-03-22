import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {UserArea} from '../../app/clases/entities/user-area';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UserAreaRepository {

  public sqlite: SQLite;

  db: SQLiteObject = null;
  private dbReady = new BehaviorSubject<boolean>(false);
  constructor(private platform:Platform) {

  }

  public insert(user: UserArea){
       this.platform.ready().then(() => {
                this.sqlite = new SQLite();
                this.sqlite.create({ name: 'tracker-mobile.db', location: 'default' }).then((db) => {
                  let sql = 'INSERT INTO USER_AREA(ID_USER,ID_AREA, NAME_AREA) VALUES(?,?,?)';
                  return db.executeSql(sql, [user.userId,user.areaId, user.areaName]);
                    }, (error) => {
                        console.info("Unable to execute sql " + JSON.stringify(error));
                    })
             }, (err) => {
                    console.info("Error opening database: " + err);
            });

    }

   public update(user: UserArea){
        let sql = 'UPDATE USER_AREA SET NAME_AREA=? WHERE ID=?';
        return this.db.executeSql(sql, [user.areaName,user.areaId]);
   }


}
