import React from 'react';
import { Menu, Item, Separator} from 'react-contexify';
import { faTerminal, faTools, faPowerOff, faSync, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ContextMenuIconContainer from './ContextMenuIconContainer';
import { withState } from 'recompose';

let text = 'Ligar';
function status(status){
  if(status==1){
    text = 'Desligar';
    return false;
  }
  if(status==0){
    text = 'Ligar';
    return true;
  }
  if(status==2){
    text = '';
    return true;
  }
  console.log(status)
}
let isInactive = ({ props }) => status(props.status);
let noTasking = ({ props }) => props.configurations.task!=null;
let locked = ({ props }) => props.parent.models[props.options.id].isLocked();

const HostContextMenu = withState('state', 'setState', 0)(({
  configureComponent,
  state,
  setState
}) => (
  <Menu id="host" onShown={() => {setState(1)} } onHidden={() => {setState(0)}}>
    <Item disabled={isInactive || locked}
      onClick={(data) => {
        const nodeID = data.props.options.id
        const node = data.props.parent.models[nodeID]
        node.functions.terminal(data.props.configurations.openstackID);
      }
      }
    >
      <ContextMenuIconContainer>
        <FontAwesomeIcon icon={faTerminal}/>
      </ContextMenuIconContainer>
      Acessar
    </Item>
    <Item disabled={isInactive || locked}
      onClick={(data) => {
        const nodeID = data.props.options.id
        const node = data.props.parent.models[nodeID]
        node.functions.reboot(data.props.configurations.openstackID)
              
      }
      }
    >
      <ContextMenuIconContainer>
        <FontAwesomeIcon icon={faSync}/>
      </ContextMenuIconContainer>
      Reiniciar
    </Item>
    <Item disabled={locked}
      onClick={(data) => {
        const nodeID = data.props.options.id
        const node = data.props.parent.models[nodeID]
        data.props.status==1 ? node.functions.powerOff() : node.functions.powerOn()
      }
      }
    >
      <ContextMenuIconContainer>
        <FontAwesomeIcon icon={faPowerOff}/>
      </ContextMenuIconContainer>
      {text}
    </Item>
    <Item disabled={isInactive || locked}
      onClick={(data) => {
        const nodeID = data.props.options.id
        const node = data.props.parent.models[nodeID]
        configureComponent(node)
      }
      }
    >
      <ContextMenuIconContainer>
        <FontAwesomeIcon icon={faTools}/>
      </ContextMenuIconContainer>
      Configurações
    </Item>
    <Item disabled={locked}
      onClick={(data) => {
        const nodeID = data.props.options.id
        const node = data.props.parent.models[nodeID]
        node.functions.delete();
              
      }
    }
    >
      <ContextMenuIconContainer>
        <FontAwesomeIcon icon={faTrashAlt}/>
      </ContextMenuIconContainer>
      Excluir
    </Item>
  </Menu>
));

export default HostContextMenu;
