import { Injectable } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite';
import { DB_CONFIG} from '../../config/app-constants';

/*
  Generated class for the DbManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbManagerProvider {

    constructor(public sqlite: SQLite) {}

    initTables(db){
        db.executeSql('CREATE TABLE IF NOT EXISTS USER_ROLE (ID_ROLE INTEGER PRIMARY KEY, NAME_USER TEXT)', []);
        db.executeSql('CREATE TABLE IF NOT EXISTS USER_AREA (ID_USER INTEGER, ID_AREA INTEGER, NAME_AREA TEXT,PRIMARY KEY(ID_USER,ID_AREA))', []);
        db.executeSql('CREATE TABLE IF NOT EXISTS ATTRIBUTE_TYPE (ID_ATTRIBUTE_TYPE INTEGER, NM_ATTRIBUTE_TYPE TEXT, VL_ATTRIBUTE_TYPE TEXT, NM_WEB_COMPONENT TEXT, PRIMARY KEY(ID_ATTRIBUTE_TYPE) )', []);
        db.executeSql('CREATE TABLE IF NOT EXISTS ATTRIBUTE (ID_ATTRIBUTE INTEGER, NM_ATTRIBUTE TEXT, CD_ATTRIBUTE TEXT, VL_ATTRIBUTE_SIZE INTEGER, ID_COMBO_CATEGORY INTEGER, ID_ATTRIBUTE_TYPE INTEGER, PRIMARY KEY(ID_ATTRIBUTE) )', []);
        db.executeSql('CREATE TABLE IF NOT EXISTS CASES (ID_CASE INTEGER, ID_ELEMENT INTEGER, ID_ELEMENT_TYPE INTEGER, ID_CASE_STATUS INTEGER, NR_CASE INTEGER,FG_SHARED INTEGER,DT_SHARED TEXT,PRIMARY KEY(ID_CASE) )', []);
        db.executeSql('CREATE TABLE IF NOT EXISTS COMBO_CATEGORY (ID_COMBO_CATEGORY INTEGER, NM_COMBO_CATEGORY TEXT )', []);
        db.executeSql('CREATE TABLE IF NOT EXISTS ETYPE_CONFIG_ATTRIBUTE (ID_ATTRIBUTE INTEGER, ID_ELEMENT_TYPE_CONFIG INTEGER, ID_ATTRIBUTE_TYPE INTEGER, ID_COMBO_CATEGORY INTEGER,FG_MANDATORY INTEGER, PRIMARY KEY(ID_ATTRIBUTE,ID_ELEMENT_TYPE_CONFIG) )', []);
        db.executeSql('CREATE TABLE IF NOT EXISTS WORKITEM_ELEMENT (ID_WORK_ITEM_ELEMENT INTEGER, ID_ELEMENT INTEGER, ID_CASE INTEGER,ID_ELEMENT_TYPE_CONFIG INTEGER, ID_WORK_ITEM_STATUS INTEGER,ID_PARENT INTEGER,NR_ORDER INTEGER,NR_SEQUENCIAL INTEGER,NM_WORKITEM_TEMPLATE TEXT,NM_WORKITEM_STATUS TEXT,DE_CANCEL TEXT, DE_NOTES TEXT, PRIMARY KEY(ID_WORK_ITEM_ELEMENT) )', []);
        db.executeSql('CREATE TABLE IF NOT EXISTS PROJECT_SUBPROJECT ( ID_PROJECT_OF INTEGER, ID_ELEMENT_PROJECT_OF INTEGER, ID_ELEMENT_STATUS_PROJECT_OF INTEGER, ID_SUBPROJECT INTEGER, ID_ELEMENT_SUBPROJECT INTEGER, ID_ELEMENT_STATUS_SUBPROJECT INTEGER, NM_PROJECT_OF TEXT, NM_SUBPROJECT TEXT, PRIMARY KEY(ID_PROJECT_OF,ID_SUBPROJECT) )', []);
    }

    public createDatabase(){
      this.sqlite.create({
        name: 'tracker-mobile.db',
        location: 'default' // the location field is required
      })
      .then((db) => {
         this.initTables(db);
        console.log(db);
      })
      .catch(error =>{
        console.error(error);
      });
    }

    public removeDatabase(){
      this.sqlite.deleteDatabase(DB_CONFIG).then(()=>{
        console.log("DB removed");
      })
      .catch(error =>{
        console.error("Error removing db:"+error);
      });
    }



}
