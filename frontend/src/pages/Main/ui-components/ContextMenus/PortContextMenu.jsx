import React from 'react';
import { Menu, Item, Separator} from 'react-contexify';
import { faTerminal, faTools, faPowerOff, faSync, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ContextMenuIconContainer from './ContextMenuIconContainer';
import { withState } from 'recompose';

let text = 'Porta Desconectada';
function status(status, build, link){
  if(Object.keys(link).length==0){
    return true;
  }
  if(!status){
    text = 'Ativar Porta';
  }
  if(status && !build){
    text = 'Desativar Porta';
    return false;
  }
}

let isInactive = ({ props }) => status(props.status, props.build, props.links);

const PortContextMenu = withState('state', 'setState', 0)(({
  configureComponent,
  state,
  setState
}) => (
  <Menu id="port" onShown={() => {setState(1)} } onHidden={() => {setState(0)}}>
    <Item disabled={isInactive}
      onClick={(data) => {
        const portName = data.props.options.name
        const port = data.props.parent.ports[portName]
        data.props.status ?
        port.functions.disable(data.props.portId) :
        port.functions.enable(data.props.portId)
      }
      }
    >
      <ContextMenuIconContainer>
        <FontAwesomeIcon icon={faPowerOff}/>
      </ContextMenuIconContainer>
      {text}
    </Item>
    <Item disabled={isInactive}
      onClick={(data) => {
        const portName = data.props.options.name
        const port = data.props.parent.ports[portName]
        port.functions.disconnectLink()
      }
      }
    >
      <ContextMenuIconContainer>
        <FontAwesomeIcon icon={faPowerOff}/>
      </ContextMenuIconContainer>
      Desconectar Link
    </Item>
    
  </Menu>
));

export default PortContextMenu;
