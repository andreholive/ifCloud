import { BaseModel } from '../../core/BaseModel';
import ServerFunctions from './Debian10Functions';

export default class Debian10Model extends BaseModel {
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
    this.functions = new ServerFunctions(this)
  }
  
}
