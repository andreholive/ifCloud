import React from 'react';
import { Menu, Item, Separator } from 'react-contexify';
import {Settings} from '../Icons';
import ContextMenuIconContainer from './ContextMenuIconContainer';

const ComponentContextMenu = ({
  configureComponent,
}) => (
  <Menu id="component">
    
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
      Configurações
    </Item>
  </Menu>
);

export default ComponentContextMenu;
