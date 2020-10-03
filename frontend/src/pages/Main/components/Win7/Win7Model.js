import { BaseModel } from '../../core/BaseModel';
import ServerFunctions from './Win7Functions';

export default class Win7Model extends BaseModel {
  initialize(configurations) {
    const INPUT_PORTS_NUMBER = parseInt(
      configurations.INPUT_PORTS_NUMBER,
      10,
    );
    for (let i = 0; i < INPUT_PORTS_NUMBER; i += 1) {
      this.addPort(`eth${i}`);
    }
    this.configurations.portsNumber = configurations.INPUT_PORTS_NUMBER;
    this.configurations.tipo = 'Host'
    this.configurations.vmstate='stopped';
    this.configurations.task=null;
    this.functions = new ServerFunctions(this)
    this.portChecked = false;
  }
  
}
