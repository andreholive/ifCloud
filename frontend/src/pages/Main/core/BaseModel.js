import { Point } from '@projectstorm/geometry';
import { NodeModel } from '@projectstorm/react-diagrams';
import PortModel from './Port/PortModel';


const getPort = port => {
  if (port instanceof PortModel) return port;
  return new PortModel({ name: port });
};

export class BaseModel extends NodeModel {
  constructor(type, configurations, socket, engine) {
    super({ type });
    this.socket = socket
    this.engine=engine;
    this.status=0;
    this.task=null;
    if(configurations.id){
      this.options.id = configurations.id
      }
    this.configurations = configurations;
    this.initialize(configurations)
  }

  getId(){
		var randomized = Math.ceil(Math.random() * Math.pow(10,10));
		var digito = Math.ceil(Math.log(randomized));
		while(digito > 10){
			digito = Math.ceil(Math.log(digito));
		}
		var id = randomized + '-' + digito;
		return id;
	}

  serialize() {
    return {
      ...super.serialize(),
      configurations: this.configurations
    };
  }

  addPort(arg) {
    const port = getPort(arg);
    super.addPort(port);
  }

  
  removePort(arg) {
    const port = getPort(arg);
    super.removePort(port);
  }

  getInputPorts() {
    return Object.fromEntries(
      Object.entries(this.getPorts()).filter(([, port]) =>
        port.isInput(),
      ),
    );
  }

  getNumberPorts() {
    return Object.entries(this.getInputPorts()).length;
  }

  getOutputPorts() {
    return Object.fromEntries(
      Object.entries(this.getPorts()).filter(
        ([, port]) => !port.isInput(),
      ),
    );
  }

  getAllLinks() {
    return Object.values(this.getPorts())
      .map(port => port.getMainLink())
      .filter(link => !!link)
      .reduce(
        (arr, link) => [...arr, link],
        [],
      );
  }

  clone(...args) {
    const clone = super.clone(...args);
    clone.setPosition(new Point(this.getX() + 15, this.getY() + 15));
    return clone;
  }

  initialize() {}

  onSimulationStart() {}

  onSimulationPause() {}

  onSimulationStop() {}

  step() {}

  
}
