import {
  State,
  Action,
  InputType,
} from '@projectstorm/react-canvas-core';
import {
  PortModel,
  LinkModel,
} from '@projectstorm/react-diagrams-core';

import DragCanvasState from './DragCanvasState';
import DragNewLinkState from './DragNewLinkState';
import MoveItemsState from './MoveItemsState';
import SelectingState from './SelectingState';

/**
 * This class defines custom handlers (called states) to respond to
 * clicking events on certain elements.
 */
export default class States extends State {
  constructor(socket) {
    super({
      name: 'diagram-states',
    });
    this.socket = socket
    this.childStates = [new SelectingState()];
    this.dragCanvas = new DragCanvasState();
    this.dragNewLink = new DragNewLinkState(this.socket);
    this.dragItems = new MoveItemsState();
    // Determine what was clicked on
    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: event => {
          const element = this.engine
            .getActionEventBus()
            .getModelForEvent(event);
          // The canvas was clicked on, transition to the dragging canvas state
          if (!element) {
            this.transitionWithEvent(this.dragCanvas, event);
          }
          // Initiate dragging a new link
          else if (element instanceof PortModel) {
            this.transitionWithEvent(this.dragNewLink, event);
          }
          // Move items
          else {
            this.transitionWithEvent(this.dragItems, event);
          }
        },
      }),
    );
    
  }
}
