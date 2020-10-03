import React from 'react';
import { Menu, Item } from 'react-contexify';
import { faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  
  Settings,
  
} from '../Icons';
import ContextMenuIconContainer from './ContextMenuIconContainer';

const RouterContextMenu = ({
  configureComponent,
}) => (
  <Menu id="router">
    
    <Item
      onClick={(data) => {
        const nodeID = data.props.options.id
        const node = data.props.parent.models[nodeID]
        configureComponent(node)
      }
      }
    >
      <ContextMenuIconContainer>
        <Settings />
      </ContextMenuIconContainer>
      Configurar Roteador
    </Item>
    <Item
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
);

export default RouterContextMenu;
