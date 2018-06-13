import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Component, OnInit,} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, Platform} from 'ionic-angular';
import {ProjectLocalProvider} from '../../providers/project-local/project-local';
import {WorkitemElement} from '../../app/clases/entities/workitem-element';
import {ElementTypeConfigAttribute} from '../../app/clases/entities/element-type-config-attributes';
import {ProjectSubproject} from '../../app/clases/entities/project-subproject';
import {Cases} from '../../app/clases/entities/cases';
import {CasesLocalPage} from '../cases-local/cases-local';
import * as _ from "lodash";
import {CasesPage} from "../cases/cases";
import {CORDOVA} from "../../config/app-constants";
import {ProjectProvider} from "../../providers/project/project";

@Component({
  selector: 'page-project-local',
  templateUrl: 'project-local.html',
})
export class ProjectLocalPage implements OnInit {

  projectList: ProjectSubproject[];
  projectListResp: ProjectSubproject[];

  constructor(public navCtrl: NavController,
              private modalCtrl: ModalController,
              private platform:Platform,
              public navParams: NavParams,
              private projectLocalProvider: ProjectLocalProvider,
              private projectService:ProjectProvider) {
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    if(this.platform.is(CORDOVA)){
    this.getAllProjects();
    }else{
      this.getRemoteProjects();
    }
  }

  getAllProjects() {
    this.projectLocalProvider.findAllProjects()
      .subscribe(resp => {
        this.projectListResp = resp;
        this.projectList = _.cloneDeep(this.projectListResp);
      }, e => {
        console.log(e);
      });
  }

   getRemoteProjects(){
      this.projectService.getAllRemoteProjectSubProject().then(projects => {
        this.projectList = projects;
        this.projectListResp = projects;

      }).catch(error => {
        console.error(error);
        this.projectList = [];
        this.projectListResp = [];
      });

    }


  filterElements(ev: any) {
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.projectList = this.projectListResp.filter((item) => {
        return ((item.projectName.toLowerCase() + item.subprojectName.toLowerCase()).indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.projectList = _.cloneDeep(this.projectListResp);
    }
  }

  onProjectSelect(project: ProjectSubproject) {
    console.log("Selected Item", JSON.stringify(project));
    this.navCtrl.push(CasesLocalPage, {project: project});

  }

}
