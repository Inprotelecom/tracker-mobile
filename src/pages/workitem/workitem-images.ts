import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ImagePicker,ImagePickerOptions } from '@ionic-native/image-picker';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {Platform,IonicPage, NavController, NavParams, ToastController, ViewController,SegmentButton,LoadingController} from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Geolocation} from "@ionic-native/geolocation";
import {WiElementAttachment} from "../../app/clases/entities/wi-element-attachment";
import {WiElementAttachmentRepository} from "../../providers/repository/wi-element-attachment";
import {WorkitemAttachmentProvider} from '../../providers/workitem-attachment/workitem-attachment';
import {WorkitemElement} from "../../app/clases/entities/workitem-element";
import * as _ from 'lodash';
import {FilesSegmentEnum} from "../../app/enums/files_segment_enum";
import { URL_TRACKER_SERVICE,TRACKER_DOWNLOAD_IMAGES} from '../../config/url.services';
import { FileOpener } from '@ionic-native/file-opener';
import dateFormat from 'dateformat';
import {DT_FORMAT_WEB} from "../../config/app-constants";

@Component({
  selector: 'page-workitem-images',
  templateUrl: 'workitem-images.html',
})
export class WorkitemImagesPage {
  node;
  segment=FilesSegmentEnum;
  segmentSelected:string=FilesSegmentEnum.FORM;
  wiElementAttachment:WiElementAttachment;
  wiElementAttachmentResp:WiElementAttachment;
  workitemElement:WorkitemElement;


  imageData:string;
  latitude:string;
  longitud:string;


  wiElementAttachmentList:Observable<WiElementAttachment[]>;
  wiElementAttachmentRemote:Observable<WiElementAttachment[]>;
  remoteFilesSelected:boolean=false;

  messageConf={
    content: 'Please wait...'
  }

  constructor(private viewCtrl:ViewController,
              private toastCtrl:ToastController,
              private camera:Camera,
              private geolocation: Geolocation,
              private navParams:NavParams,
              private wiElementAttachmentRepository:WiElementAttachmentRepository,
              private workitemAttachmentProvider:WorkitemAttachmentProvider,
              private imagePicker: ImagePicker,
              private transfer: FileTransfer,
              private file: File,
              private fileOpener: FileOpener,
              private platform:Platform,
              private loadingController:LoadingController) {

    this.node=this.navParams.get("node");

    //this.workitemElement=this.navParams.get("wiElement");
    this.initWiElementAttribute();
  }

  initWiElementAttribute(){
    this.remoteFilesSelected=false;
    this.cleanFile();

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

    }, (err) => {
      console.log("Error en camera:",JSON.stringify(err));
    });


  }

  showGallery(){
    const optionsImagePicker: ImagePickerOptions = {
      quality: 50,
      outputType:1,
      maximumImagesCount:1
    }
    this.imagePicker.getPictures(optionsImagePicker).then((results) => {
        for (var i = 0; i < results.length; i++) {
            //console.log('Image URI: ' + results[i]);
            this.imageData=results[i];
        }
      }, (err) => {console.error("Show Gallery",JSON.stringify(err)) });

    }



  downloadFile(wiAttachment:WiElementAttachment) {
    const fileTransfer: FileTransferObject = this.transfer.create();

    let documentsDirectory='';
    if (this.platform.is('ios')) {
        documentsDirectory = this.file.documentsDirectory;
      } else if (this.platform.is('android')) {
        documentsDirectory = this.file.dataDirectory;
    }
    let url:string=`${URL_TRACKER_SERVICE}${TRACKER_DOWNLOAD_IMAGES}?image=${wiAttachment.wiElementAttachmentId}`;
        let   loading = this.loadingController.create(this.messageConf);
        loading.present();
        fileTransfer.download(url, documentsDirectory + wiAttachment.filename,true).then((entry) => {
          console.log('download complete: ' + entry.toURL());
          this.showMessage('File downloaded successfully');
          //this.document.viewDocument(entry.toURL(), wiAttachment.type, options)


          this.fileOpener.open(entry.toURL(), wiAttachment.type)
          .then(() =>{
            loading.dismiss();
            console.log('File is opened');
          })
          .catch(e => {
            loading.dismiss();
            console.log('Error opening file', e)
            });

    }, (error) => {
          loading.dismiss();
          this.showMessage('Error downloading file');
          console.error("DownloadFile",JSON.stringify(error));
    });
}

  saveFile(){

    if(this.imageData==''){
      this.showMessage('File is mandatory');
    }else{
    this.wiElementAttachment.type='jpeg';
    this.wiElementAttachment.file=this.imageData;
    this.wiElementAttachment.synced=false;
    this.wiElementAttachment.modifiedDate=dateFormat(new Date(),DT_FORMAT_WEB,true);
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
  }

  private cleanFile(){
    this.wiElementAttachment=new WiElementAttachment();
    this.wiElementAttachment.etypeConfigDocId=this.node.etypeConfigDoc;
    this.wiElementAttachment.workitemElementId=this.node.workItemElementId;
    this.wiElementAttachment.synced=false;
    this.imageData='';
    this.wiElementAttachment.name='';
    this.wiElementAttachment.comments='';
    this.wiElementAttachment.order=0;
    this.wiElementAttachmentResp=_.cloneDeep(this.wiElementAttachment);

    console.info('Cleaning attachment object',JSON.stringify(this.wiElementAttachment));
  }

  showPosition(){

    this.geolocation.getCurrentPosition().then((resp) => {
      // WiElementAttachmentRepositoryresp.coords.latitude
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


  segmentChanged(segmentButton:SegmentButton){
    console.log(JSON.stringify(segmentButton.value+'-'+this.segmentSelected));
    switch(this.segmentSelected){
      case FilesSegmentEnum.FORM:
      break;
      case FilesSegmentEnum.LOCAL_FILES:
      this.wiElementAttachmentList=
        this.wiElementAttachmentRepository
            .findWiElementAttachmentByWiElementIdAndEtypeConfigDocId(this.node.workItemElementId,this.node.etypeConfigDoc);
      break;
      case FilesSegmentEnum.REMOTE_FILES:
        if(!this.remoteFilesSelected){
        this.wiElementAttachmentRemote=
                this.workitemAttachmentProvider.findRemoteWiElementAttachment(this.node.workItemElementId,this.node.etypeConfigDoc);
        this.remoteFilesSelected=true;
        }
      break;
    }

  }

}
