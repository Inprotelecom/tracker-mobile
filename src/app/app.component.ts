import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { DbManagerProvider} from '../providers/db-manager/db-manager';
import { SQLite } from '@ionic-native/sqlite';

import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public sqlite: SQLite,
    public dbManager:DbManagerProvider) {


    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.createDatabase();
    });
  }

  private createDatabase(){
    this.sqlite.create({
      name: 'tracker-mobile.db',
      location: 'default' // the location field is required
    })
    .then((db) => {
      this.dbManager.setDatabase(db);
      this.dbManager.initTables();
      console.log(db);
    })
    .catch(error =>{
      console.error(error);
    });
  }
}
