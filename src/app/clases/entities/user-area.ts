export class UserArea{
  areaId:number;
  userId:number;
  areaName:string;

  constructor(userId:number,areaId:number,areaName:string){
    this.areaId=areaId;
    this.areaName=areaName;
    this.userId=userId;
  }


}
