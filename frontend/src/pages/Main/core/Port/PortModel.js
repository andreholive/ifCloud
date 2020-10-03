import { PortModel as RDPortModel } from '@projectstorm/react-diagrams';
import PortFunctions from './PortFunctions'
import LinkModel from '../Link/LinkModel';

import linkHandlers from '../Diagram/Command/linksHandlers'

export default class PortModel extends RDPortModel {
  constructor(options = {}) {
    super({
      type: 'Port',
      maximumLinks: 1,
      ...options,
    });
    this.status = 3;
    this.build = false;
    this.value = null;
    this.input = true;
    this.netId = null;
    this.portId = null;
    this.macAddr = null;
    this.cidr = null;
    this.address = null;
    this.dhcp=false;
    this.range={
      start:'',
      end:'',
    }
    this.functions = new PortFunctions(this);
    this.registerListener(linkHandlers(this));
  }

  serialize() {
    return {
      ...super.serialize(),
      input: this.input,
      value: this.value,
      netId: this.netId,
      portId: this.portId,
      macAddr: this.macAddr,
      status: this.status,
      build: this.build,
      cidr: this.cidr,
      address: this.address,
      dhcp: this.dhcp,
      range: this.range,
    };
  }
  
  deserialize(event, engine) {
    super.deserialize(event, engine);
    this.value = event.data.value;
    this.input = event.data.input;
    this.netId = event.data.netId;
    this.portId = event.data.portId;
    this.macAddr = event.data.macAddr;
    this.build = event.data.build;
    this.cidr = event.data.cidr;
    this.status = event.data.status;
    this.address = event.data.address;
    this.dhcp = event.data.dhcp;
    this.range = event.data.range
  }

 

  generateMacAddr(){
    var hexDigits = "0123456789abcdef";
    var macAddress = "ca:fe:00:";
    for (var i = 0; i < 3; i++) {
        macAddress+=hexDigits.charAt(Math.round(Math.random() * 15));
        macAddress+=hexDigits.charAt(Math.round(Math.random() * 15));
        if (i != 2) macAddress += ":";
    }

    this.macAddr = macAddress;
  }

  setMacAddr(macAddr){
    this.macAddr = macAddr;
  }
  
  setID(id){
    this.portId = id;
  }

  setNetwork(id){
    this.netId = id;
    this.value = id;
  }

  getNetwork(){
    return this.netId;
  }
  isInput() {
    return this.input === true;
  }

  isOutput() {
    return this.input === false;
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    this.value = value;
  }

  isNewLinkAllowed() {
    return (
      Object.keys(this.getLinks()).length < this.getMaximumLinks()
    );
  }

  canLinkToPort(port) {
    return port.isNewLinkAllowed() && this.getID() !== port.getID();
  }

  createLinkModel() {
    if (this.isNewLinkAllowed()) {
      return new LinkModel();
    }
    return null;
  }

  getMainLink() {
    const links = Object.values(this.getLinks());
    return links.length > 0 ? links[0] : null;
  }
  
  action(){
    if(this.status==2) return 'var(--onToOff)';
    return 'none'
  }

  getColor() {
   const link = this.getMainLink();
   if(this.status==3) return 'var(--port-unconnected)';
   if(this.status==1 && link){
    return 'var(--link-selected)'
   } 
   if(this.status==0 && link){
    return 'var(--value-error)'
   }
   if(!link){
    return 'var(--port-unconnected)';
   }
   return 'var(--port-unconnected)';
  }
}
