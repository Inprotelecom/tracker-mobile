import {Attribute} from './attribute';
import {ComboValue} from './combo-value';

export class WiElementAttribute{

  wiElementAttributeId:number;
  attributeId:number;
  value:string;
  workitemElementId:number;
  synced:boolean;
  attribute:Attribute;
  comboValue:ComboValue[];
  modifiedDate:string;
  order:number;

  constructor(){
  }


}
