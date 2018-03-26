import { Component,OnInit } from '@angular/core';
import { NavController, NavParams,ModalController,ViewController } from 'ionic-angular';
import { ProjectSubproject} from '../../app/clases/entities/project-subproject';
import { ProjectProvider} from '../../providers/project/project';
import { CasesPage} from '../cases/cases';

@Component({
  selector: 'page-project',
  templateUrl: 'project.html',
})
export class ProjectPage implements OnInit{

  projectList:ProjectSubproject [];
  projectListResp:ProjectSubproject [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private projectService:ProjectProvider,
              public modalCtrl: ModalController,
              public viewCtrl:ViewController) {

  }

  ngOnInit() {

    this.getLocalProjects();
  }

  getRemoteProjects(refresher){

    setTimeout(() => {
      this.projectService.getAllRemoteProjectSubProject().then(projects => {
        this.projectList=projects;
        this.projectListResp=projects;
        refresher.complete();
      }).catch( error => {
        console.error( error );
        this.projectList=[];
        this.projectListResp=[];
        refresher.complete();
      });

    }, 500);


  }

  getLocalProjects(){
    console.error( "Get local projects" );
    this.projectService.getAllLocalProjectSubProject().then(projects => {
      this.projectList=projects;
      this.projectListResp=projects;
    }).catch( error => {
      console.error( error );
      this.projectList=[];
      this.projectListResp=[];
    });

  }

  filterElements(ev: any) {
      // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.projectList = this.projectListResp.filter((item) => {
        return ((item.projectName.toLowerCase()+item.subprojectName.toLowerCase()).
        indexOf(val.toLowerCase()) > -1);
      })
    }else{
      this.projectList=this.projectListResp;
    }
  }

  onProjectSelect(project:ProjectSubproject){

    console.log("Selected Item", JSON.stringify(project));
    let modal=this.modalCtrl.create(CasesPage,{project:project});
    modal.present();
  }




}
