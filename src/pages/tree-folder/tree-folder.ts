import { Component, Input } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

@Component({
  selector: 'tree-folder',
  templateUrl: 'tree-folder.html'
})
export class TreeFolderComponent {
  @Input('nodes') nodes; //nodes structure to draw
  shownGroup:any; //ACTUALLY EXPANDED NODE

  constructor(public platform: Platform, public nav: NavController, public navParams: NavParams) {

  }
  //NODE CLICK FUNCTION: If the node is a child (it has the component property)
  clickNode(node) {
    if(!(node.component)){
      //NODE IS A FOLDER --> expand childs
      this.showChild(node);
    }else{
      //NODE IS A FILE --> open Page Component in data model, passing the node such as parameter.
      this.shownGroup = null;
      this.nav.push(node.component, {node: node});
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

   if(node.sub){
      if(this.shownGroup === node){
        //folder open
        return 'ios-folder-open-outline';
      }
    }else{
      return 'ios-document';
    }
    return 'ios-folder';

  }

}
