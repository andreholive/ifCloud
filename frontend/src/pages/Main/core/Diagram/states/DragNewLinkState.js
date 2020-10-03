import {
  AbstractDisplacementState,
  Action,
  InputType,
} from '@projectstorm/react-canvas-core';
import {
  NodeModel,
  PortModel,
} from '@projectstorm/react-diagrams-core';

import { nearby, getLandingLink } from './common';
import handleLinkDrag from './handleLinkDrag';

const userId = localStorage.getItem("userId");
/**
 * This State is responsible for handling link creation events.
 */
export default class DragNewLinkState extends AbstractDisplacementState {
  constructor(socket) {
    super({ name: 'drag-new-link' });
    this.socket = socket
    

    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: event => {
          this.moveDirection = undefined;
          this.hasStartedMoving = false;

          this.port = this.engine.getMouseElement(event.event);

          if (
            !(this.port instanceof PortModel) ||
            this.port.isLocked()
          ) {
            this.eject();
            return;
          }

          this.link = this.port.createLinkModel();
          
          if (!this.link) {
            this.eject();
            return;
          }
          this.link.setSelected(true);
          this.link.setSourcePort(this.port);
          this.engine.getModel().clearSelection();
          this.engine.getModel().addLink(this.link);
          this.port.reportPosition();
          const data = {
            port: this.port.options.name,
            device: this.port.parent.options.id,
            user: userId
          }
          this.socket.emit('link-create', data)
        },
      }),
    );

    this.registerAction(
      new Action({
        type: InputType.MOUSE_UP,
        fire: event => {
          const model = this.engine.getMouseElement(event.event);

          // Disallows creation under nodes
          if (
            model instanceof NodeModel ||
            this.isNearbySourcePort(event.event)
          ) {
            this.link.remove();
            this.engine.repaintCanvas();
          }

          // Link connected to port
          if (
            model instanceof PortModel &&
            this.port.canLinkToPort(model)
          ) {
            this.link.setTargetPort(model);
            this.link.addLabel(this.link.sourcePort.options.name)
            this.link.addLabel(this.link.targetPort.options.name)
            const data = {
              port: this.port.options.name,
              targetPort: this.link.targetPort.options.name,
              targetDevice: this.link.targetPort.parent.options.id,
              device: this.port.parent.options.id,
              user: userId
            }
            this.socket.emit('link-connect', data)
            model.reportPosition();
            this.engine.repaintCanvas();
            this.fireEvent();
            return;
          }

          this.fireEvent();
        },
      }),
    );
  }

  

  
  fireEvent = () => {
    const targetPort =  this.link.targetPort;
    if(targetPort)
    {
    const source = this.link.sourcePort.parent;
    const target = this.link.targetPort.parent;
    const tipo_source = source.configurations.tipo;
    const tipo_target = target.configurations.tipo;
    const sourcePort = this.link.sourcePort;
    if(target == source || target.isLocked() || source.isLocked())
    {
      this.link.remove();
      return
    }
    const  create = this.port.functions.createLink(this.link)
    if(!create)this.link.remove();
  }
  else{
      const data = {
        port: this.port.options.name,
        device: this.port.parent.options.id,
        user: userId
      }
    this.link.remove();
    this.socket.emit('link-remove', data)
  }
  };



  isNearbySourcePort(event) {
    const point = this.engine.getRelativeMousePoint(event);

    const sourcePort = this.link.getSourcePort();
    const sourcePortSize = sourcePort.width;
    const sourcePortPosition = sourcePort.getPosition();

    return nearby(point, sourcePortPosition, sourcePortSize);
  }

  /**
   * Updates link's points upon mouse move.
   */
  fireMouseMoved(event) {
    handleLinkDrag.call(this, event, this.link, this.socket);
  }
}
