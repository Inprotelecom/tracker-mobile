import { Component, OnInit } from '@angular/core';
import {ViewController} from "ionic-angular";
import { Camera,CameraOptions} from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})
export class Upload implements OnInit{

  imagePreview:string;
  latitude:string;
  longitud:string;

  constructor(private viewCtrl:ViewController,
    private camera:Camera,
    private geolocation: Geolocation) {
  }


    ngOnInit() {



    }

  closeModal(){
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
      this.imagePreview = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     console.log("Error en camera:",JSON.stringify(err));
    });


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
