import React from 'react';
import { Port } from '../../core/Port/Port';
import './host.css'
import { MenuProvider } from 'react-contexify';
import styled from 'styled-components';

import { PortExtension, distributePorts } from '../portExtendUtils';

var build = false;
const Wrapper = styled.div`
${props => {props.theme=build}}
        
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 130px;
  height: 130px;
  transition: 100ms linear;
`;

const PositionedPort = styled(Port)`
  position: absolute;
  
  ${props => {
    if (props.name === 'out') return '';
    return `right: ${props.position * 15 - 5}px;`;
  }}

  ${props => {
    if (props.name === 'out') return 'top: 0px';
    return 'top: 0px';
  }};
  
`;
export const Shape = () => (
  <svg 
	 viewBox="0 0 188.6 153.4"
   height="130"
   width="130"
   >
<g transform="matrix(1.2024 0 0 1.2024 -50.551 -10.729)">
	<rect x="102.6" y="104.3" fill="#5B5B5B" width="34.6" height="27.9"/>
	<path fill="#848484" d="M96.5,130h46.7c1.2,0,2.2,1,2.2,2.2l0,0c0,1.2-1,2.2-2.2,2.2H96.5c-1.2,0-2.2-1-2.2-2.2l0,0
		C94.5,131.1,95.3,130,96.5,130z"/>
</g>
<path fill="#333333" stroke="#2B2B2B" strokeWidth="2.4048" strokeLinecap="round" strokeLinejoin="round" d="M8.5,2.8h170.4
	c3.6,0,6.7,3,6.7,6.7v109.1c0,3.6-3,6.7-6.7,6.7H8.5c-3.6,0-6.7-3-6.7-6.7V9.3C1.8,5.9,4.9,2.8,8.5,2.8z"/>
<circle fill="#B1B1B1" cx="93.7" cy="114.5" r="5.5"/>
<path fill="#2B2B2B" d="M8.5,2.8c-3.6,0-6.7,3-6.7,6.7v94.3h183.7V9.5c0-3.6-3-6.7-6.7-6.7H8.5L8.5,2.8z"/>
<path d="M8.1,9.1h171.2v88.2H7.5L8.1,9.1z"/>
<circle fill="red" cx="15.6" cy="114.5" r="3.2"/>

</svg>
);

const Win7Widget = props => {
  const { model, engine } = props;
  let {status}=model;
  const inputPorts = Object.values(model.getInputPorts());
  const portPositions = distributePorts(inputPorts.length);
  let text = '';
  let light = 'mainLight-off'
  switch(status){
    case 0:
      light = 'mainLight-off';
      break;
    case 1:
      light = 'mainLight-on';
      break;
    case 2:
      light = 'mainLight-work'
  }
  return (
    <MenuProvider id="host" storeRef={false} data={model}>
    <Wrapper selected={model.isSelected()}>
      <PortExtension
        selected={model.isSelected()}
        portPositions={portPositions}
      />
      {inputPorts.map((port, i) => (
        <PositionedPort
          key={port.getName()}
          name={port.getName()}
          model={model}
          port={port}
          engine={engine}
          position={portPositions[i]}
        />
      ))}
      <svg 
      viewBox="0 0 188.6 153.4"
      height="100"
      width="130"
      >
        <g transform="matrix(1.2024 0 0 1.2024 -50.551 -10.729)">
          <rect x="102.6" y="104.3" fill="#5B5B5B" width="34.6" height="27.9"/>
          <path fill="#848484" d="M96.5,130h46.7c1.2,0,2.2,1,2.2,2.2l0,0c0,1.2-1,2.2-2.2,2.2H96.5c-1.2,0-2.2-1-2.2-2.2l0,0
            C94.5,131.1,95.3,130,96.5,130z"/>
        </g>
        <path fill="#333333" stroke="#2B2B2B" strokeWidth="2.4048" strokeLinecap="round" strokeLinejoin="round" d="M8.5,2.8h170.4
          c3.6,0,6.7,3,6.7,6.7v109.1c0,3.6-3,6.7-6.7,6.7H8.5c-3.6,0-6.7-3-6.7-6.7V9.3C1.8,5.9,4.9,2.8,8.5,2.8z"/>
        <circle fill="#B1B1B1" cx="93.7" cy="114.5" r="5.5"/>
        <path fill="#2B2B2B" d="M8.5,2.8c-3.6,0-6.7,3-6.7,6.7v94.3h183.7V9.5c0-3.6-3-6.7-6.7-6.7H8.5L8.5,2.8z"/>
        <path d="M8.1,9.1h171.2v88.2H7.5L8.1,9.1z"/>
        <circle className={light} cx="15.6" cy="114.5" r="3.2"/>
        <text transform="matrix(1 0 0 1 14.7861 23.9727)" className="screen">{text}</text>
      </svg> 
    </Wrapper>
    </MenuProvider>
  );
};

export default Win7Widget;
