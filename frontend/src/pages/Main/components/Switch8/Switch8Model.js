import { BaseModel } from '../../core/BaseModel';
import SwicthFunctions from './SwitchFunctions' 


export default class Swich8Model extends BaseModel {
  initialize(configurations) {
    this.configurations.tipo = 'Switch'
    this.functions = new SwicthFunctions(this);
    this.functions.distributePorts();
  }

}
