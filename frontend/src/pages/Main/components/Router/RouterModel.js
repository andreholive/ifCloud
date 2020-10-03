import { BaseModel } from '../../core/BaseModel';
import RouterFunctions from  './RouterFunctions'

export default class RouterModel extends BaseModel {
  initialize(configurations) {
    this.configurations.hostName = configurations.NOME_DISP;
    this.configurations.tipo = 'Router'
    this.functions = new RouterFunctions(this)
  }

}
