import { Component, Input } from '@angular/core';
import {ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {WorkitemImagesPage} from "../workitem/workitem-images";

@Component({
  selector: 'tree-folder',
  templateUrl: 'tree-folder.html'
})
export class TreeFolderComponent {
  @Input('nodes') nodes; //nodes structure to draw
  shownGroup:any; //ACTUALLY EXPANDED NODE

  constructor(public platform: Platform,
              public nav: NavController,
              public navParams: NavParams,
              private modalCtrl:ModalController) {

  }
  //NODE CLICK FUNCTION: If the node is a child (it has the component property)
  clickNode(node) {
    if((node.folder)){
      //NODE IS A FOLDER --> expand childs
      this.showChild(node);
    }else{
      //NODE IS A FILE --> open Page Component in data model, passing the node such as parameter.
      this.shownGroup = null;
      let modal=this.modalCtrl.create(WorkitemImagesPage, {node: node});
      modal.present();
    }
  }

  //FUNCTION TO CHANGE THE NODE WHICH IS ACTUALLY EXPANDED.
  showChild(node){
    if (this.isSelected(node)) {
      //The node is actually expanded --> contract node and don't show childs
      this.shownGroup = null;
    } else {
      //The node is actually contacted --> expand node and show childs
      this.shownGroup = node;
    }
  }
  //FUNCTION TO KNOW IF A FOLDER NODE HAVE TO BE EXPANDED OR CONTRATED
  isSelected(page){
    return this.shownGroup === page;
  }
  //FUNCTION TO GET THE ICON TO SHOW in each node
  getIcon(node){

   return node.icon;

  }

}
