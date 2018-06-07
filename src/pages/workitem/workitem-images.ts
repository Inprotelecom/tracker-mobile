import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Geolocation} from "@ionic-native/geolocation";
import {WiElementAttachment} from "../../app/clases/entities/wi-element-attachment";
import {WiElementAttachmentRepository} from "../../providers/repository/wi-element-attachment";
import {WorkitemElement} from "../../app/clases/entities/workitem-element";
import * as _ from 'lodash';
import {FilesSegmentEnum} from "../../app/enums/files_segment_enum";

@Component({
  selector: 'page-workitem-images',
  templateUrl: 'workitem-images.html',
})
export class WorkitemImagesPage {

  segment=FilesSegmentEnum;
  segmentSelected:string=FilesSegmentEnum.FORM;
  wiElementAttachment:WiElementAttachment;
  wiElementAttachmentResp:WiElementAttachment;
  workitemElement:WorkitemElement;
  node;
  imagePreview:string;
  imageData:string;
  comments:string;
  latitude:string;
  longitud:string;

  constructor(private viewCtrl:ViewController,
              private toastCtrl:ToastController,
              private camera:Camera,
              private geolocation: Geolocation,
              private navParams:NavParams,
              private wiElementAttachmentRepository:WiElementAttachmentRepository) {

    this.node=this.navParams.get("node");

    //this.workitemElement=this.navParams.get("wiElement");
    this.initWiElementAttribute();
  }

  segmentChanged(event){

  }

  initWiElementAttribute(){
    this.wiElementAttachment=new WiElementAttachment();
    console.info('node:'+JSON.stringify(this.node));
    this.wiElementAttachment.etypeConfigDocId=this.node.etypeConfigDoc;
    this.wiElementAttachment.workitemElementId=this.node.workItemElementId;
    this.wiElementAttachment.synced=false;

    this.wiElementAttachmentResp=_.cloneDeep(this.wiElementAttachment);

  }

  showMessage(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  showCamera(){

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit : true,
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      //latitude=metadata.GPS.Latitude;
      this.imageData=imageData;
      this.imagePreview = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log("Error en camera:",JSON.stringify(err));
    });


  }

  saveFile(){
    console.log("before save:",JSON.stringify(this.wiElementAttachment));
    this.wiElementAttachment.comments=this.comments;
    this.wiElementAttachment.type='jpeg';
    this.wiElementAttachment.file=this.imageData;
    this.wiElementAttachment.synced=false;
    this.wiElementAttachmentRepository.insert(this.wiElementAttachment)
      .subscribe(resp=>{
        console.log('resp image save:'+resp);
        if(resp){
          this.showMessage('Image was saved successfully');
          //this.wiElementAttachment=_.cloneDeep(this.wiElementAttachmentResp);
          this.cleanFile();
        }else{
          this.showMessage('Error trying to save');
          this.wiElementAttachment=_.cloneDeep(this.wiElementAttachmentResp);
        }
      },error=>{
        this.showMessage('Error trying to save');
        console.error('WorkitemImagesPage:'+JSON.stringify(error));
        this.wiElementAttachment=_.cloneDeep(this.wiElementAttachmentResp);

      });

  }

  private cleanFile(){
    this.imagePreview='';
    this.imageData='';
    this.comments='';
  }

  showPosition(){

    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });

  }


}
