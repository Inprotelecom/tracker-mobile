import {Component} from '@angular/core';
import {NavController, NavParams, Platform} from 'ionic-angular';
import {StatusBar} from "@ionic-native/status-bar";
import {TreeFolderComponent} from "../tree-folder/tree-folder";

@Component({
  selector: 'page-workitem-files',
  templateUrl: 'workitem-files.html',
})
export class WorkitemFilesPage {

  shownGroup: any;
  isLoggedIn: boolean = false;

  //avatar:string = GENERIC;

  pages = [
    {
      title: 'Users', icon: 'contacts',
      sub: [
        {
          title: 'Jon', icon: 'contact', sub: [
          {title: 'Email', icon: 'mail', component: TreeFolderComponent},
          {title: 'Street', icon: 'home', component: TreeFolderComponent},
          {title: 'Phone', icon: 'call', component: TreeFolderComponent}
        ]
        },
        {title: 'Sergio', icon: 'contact', component: TreeFolderComponent},
        {
          title: 'Winnie', icon: 'contact', sub: [
          {title: 'Street', icon: 'home', component: TreeFolderComponent},
          {
            title: 'Email', icon: 'mail', sub: [
            {title: 'sss@hotmail.com', icon: 'at', component: TreeFolderComponent},
            {title: 'sss@gmail.com', icon: 'at', component: TreeFolderComponent},
            {title: 'aaa@yahoo.com', icon: 'at', component: TreeFolderComponent}
          ]
          }
        ]
        }
      ]
    },
    {
      title: 'Node 02', icon: 'cube',
      sub: [
        {title: 'Node 02.1', icon: 'at', component: TreeFolderComponent},
        {title: 'Node 02.2', icon: 'at', component: TreeFolderComponent},
        {title: 'Node 02.3', icon: 'at', component: TreeFolderComponent}
      ]
    },

    {
      title: 'Tables', icon: 'grid',
      sub: [
        {title: 'Table 01', icon: 'cube', component: TreeFolderComponent},
        {title: 'Table 02', icon: 'cube', component: TreeFolderComponent},
        {title: 'Table 03', icon: 'cube', component: TreeFolderComponent}
      ]
    }
  ];



}

constructor(public
platform: Platform, public
nav: NavController, public
navParams: NavParams
)
{
  this.initializeApp();
}

initializeApp()
{

}
}
