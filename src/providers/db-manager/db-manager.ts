import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the DbManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbManagerProvider {

  db: SQLiteObject = null;

    constructor() {}

    setDatabase(db: SQLiteObject){
      if(this.db === null){
        this.db = db;
      }
    }

    initTables(){
        this.db.executeSql('CREATE TABLE IF NOT EXISTS USER_ROLE (ID_ROLE INTEGER PRIMARY KEY, NAME_USER TEXT)', []);
        this.db.executeSql('CREATE TABLE IF NOT EXISTS USER_AREA (ID_USER INTEGER, ID_AREA INTEGER, NAME_AREA TEXT,PRIMARY KEY(ID_USER,ID_AREA))', []);
        this.db.executeSql('CREATE TABLE IF NOT EXISTS ATTRIBUTE_TYPE (ID_ATTRIBUTE_TYPE INTEGER, NM_ATTRIBUTE_TYPE TEXT, VL_ATTRIBUTE_TYPE TEXT, NM_WEB_COMPONENT TEXT, PRIMARY KEY(ID_ATTRIBUTE_TYPE) )', []);
        this.db.executeSql('CREATE TABLE IF NOT EXISTS ATTRIBUTE (ID_ATTRIBUTE INTEGER, NM_ATTRIBUTE TEXT, CD_ATTRIBUTE TEXT, VL_ATTRIBUTE_SIZE INTEGER, ID_COMBO_CATEGORY INTEGER, ID_ATTRIBUTE_TYPE INTEGER, PRIMARY KEY(ID_ATTRIBUTE) )', []);
        this.db.executeSql('CREATE TABLE IF NOT EXISTS CASES (ID_CASE INTEGER, ID_ELEMENT INTEGER, ID_ELEMENT_TYPE INTEGER, ID_CASE_STATUS INTEGER, NR_CASE INTEGER, DE_CASE TEXT, DT_CREATED TEXT, PRIMARY KEY(ID_CASE) )', []);
        this.db.executeSql('CREATE TABLE IF NOT EXISTS COMBO_CATEGORY (ID_COMBO_CATEGORY INTEGER, NM_COMBO_CATEGORY TEXT )', []);
        this.db.executeSql('CREATE TABLE IF NOT EXISTS ETYPE_CONFIG_ATTRIBUTE (ID_ATTRIBUTE INTEGER, ID_ELEMENT_TYPE_CONFIG INTEGER, FG_MANDATORY INTEGER, PRIMARY KEY(ID_ATTRIBUTE,ID_ELEMENT_TYPE_CONFIG) )', []);
        this.db.executeSql('CREATE TABLE IF NOT EXISTS WORKITEM_ELEMENT (ID_WORK_ITEM_ELEMENT INTEGER, ID_ELEMENT INTEGER, ID_ELEMENT_TYPE_CONFIG INTEGER, ID_CASE INTEGER, ID_WORK_ITEM_STATUS INTEGER, DE_CANCEL TEXT, DE_NOTES TEXT, PRIMARY KEY(ID_WORK_ITEM_ELEMENT) )', []);
        this.db.executeSql('CREATE TABLE IF NOT EXISTS PROJECT_SUBPROJECT ( ID_PROJECT_OF INTEGER, ID_ELEMENT_PROJECT_OF INTEGER, ID_ELEMENT_STATUS_PROJECT_OF INTEGER, ID_SUBPROJECT INTEGER, ID_ELEMENT_SUBPROJECT INTEGER, ID_ELEMENT_STATUS_SUBPROJECT INTEGER, NM_PROJECT_OF TEXT, NM_SUBPROJECT TEXT, PRIMARY KEY(ID_SUBPROJECT) )', []);
    }

   
}
