import React from 'react';

import { PortWidget } from '@projectstorm/react-diagrams';
import { MenuProvider } from 'react-contexify';

import styled from 'styled-components';

const Circle = styled.div`
  width: 10px;
  height: 10px;
  border: var(--port-width) solid
    ${props => 
      props.link && props.status
        ? 'var(--port-connected-border)'
        : 'var(--port-unconnected-border)'
      };
        
  border-radius: 100%;
  background-color: ${props => props.port.getColor()};
  animation: ${props => props.port.action()};
  &:hover {
    background-color: var(--port-hover);
  }
`;

export class Port extends PortWidget {
  report() {
    if (this.props.port) super.report();
  }
  
  componentDidUpdate() {
    if (this.props.port) super.componentDidUpdate();
  }

  render() {
    const { name, model, port, netId, className = '' } = this.props;
    if (!port) return null;
    
    return (
      <MenuProvider id="port" storeRef={false} data={port}>
      <Circle
        className={`port ${className}`}
        data-name={name}
        data-netid={netId}
        data-nodeid={model.getID()}
        port={port}
        link={port.getMainLink()}
      />
      </MenuProvider>
    );
  }
}
