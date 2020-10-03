import { Action, InputType } from '@projectstorm/react-canvas-core';

import {BaseModel} from '../../BaseModel';
import LinkModel from '../../Link/LinkModel';

/**
 * Handles delete actions.
 */
export default class DeleteAction extends Action {
  constructor(areShortcutsAllowed) {
    super({
      type: InputType.KEY_DOWN,
      fire: ({ event }) => {
        if (!areShortcutsAllowed()) return;
        if (this.engine.getModel().isLocked()) return;

        if (this.matchesInput(event)) {
          event.preventDefault();
          this.handleAction();
        }
      },
    });
  }

  matchesInput = event => event.code === 'Delete';

  handleAction = () => {
    const entities = this.engine
      .getModel()
      .getSelectedEntities()
      .filter(model => !model.isLocked());

    this.fireEvent(entities);

    entities.forEach(model => model.remove());
    //aqui ainda existe a possibilidade de multiplos itens selecionados
    //não estou tratando isso, aqui apenas considero um item selecionado
    //this.removeNetwork(entities)
    this.engine.repaintCanvas();
  };

  removeNetwork(ent){
    if(ent[0] instanceof LinkModel){
    if(ent[0].sourcePort.parent.configurations.tipo=='router'){
      ent[0].targetPort.parent.configurations.network=null //criar uma função q verifica os hosts ligados no
    }
    if(ent[0].targetPort.parent.configurations.tipo=='router'){
      ent[0].sourcePort.parent.configurations.network=null
    }
    if(ent[0].sourcePort.parent.configurations.tipo=='host'){
      //ent[0].sourcePort.parent.removeLinkNetwork(ent[0].sourcePort.options.name)
      //ent[0].sourcePort.netId=null
      //ent[0].sourcePort.portId=null
      //ent[0].sourcePort.macAddr=null
    }
    
  
  }
    console.log(ent)
  }
  /**
   * Event is fired to be on the command manager, so the user can undo
   * and redo it.
   */
  fireEvent = entities => {
    // All selected nodes
    const nodes = entities.filter(
      model => model instanceof BaseModel,
    );

    // All selected links
    const links = entities.filter(
      model => model instanceof LinkModel,
    );

    // All links from selected nodes
    const nodesLinks = nodes.reduce(
      (arr, node) => [...arr, ...node.getAllLinks()],
      [],
    );

    this.engine.fireEvent(
      { nodes, links: [...nodesLinks, ...links] },
      'entitiesRemoved',
    );
  };
}
