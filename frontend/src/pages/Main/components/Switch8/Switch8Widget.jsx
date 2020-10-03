import React from 'react';
import { Port } from '../../core/Port/Port';
import './sw8.css'
import { MenuProvider } from 'react-contexify';
import styled from 'styled-components';

import { distributePorts } from '../portExtendUtils';

var build = false;
const Wrapper = styled.div`
${props => {props.theme=build}}
        
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 150px;
  height: 30px;

  transition: 100ms linear;
  
`;

const PositionedPort = styled(Port)`
  position: absolute;
  
  ${props => {
    if (props.name === 'out') return '';
    return `left: ${props.position * 15 - 5}px;`;
  }}

  ${props => {
    if (props.name === 'out') return 'top: 0px';
    return 'bottom: 0px';
  }};
  
`;
export const Shape = () => (
<svg 
viewBox="0 0 402 116.8"
height="50"
width="150">

<g transform="translate(7.2017 262.91)">
  <path fill="#666666" d="M36.3-255.4h304.4l53.6,39.1l-400.8-0.9L36.3-255.4z"/>
</g>
<g transform="translate(7.2017 262.91)">
  <path fill="#808080" d="M-0.7-218.3h389c3.6,0,6.5,2.9,6.5,6.5v51.7c0,3.6-2.9,6.5-6.5,6.5h-389c-3.6,0-6.5-2.9-6.5-6.5v-51.7
    C-7.2-215.4-4.3-218.3-0.7-218.3"/>
</g>
<g transform="translate(1.9684e-8 12.37)">
  <path fill="#333333" d="M14.9,40.3h373.9c2.6,0,4.7,2.1,4.7,4.7l0,0v37.4c0,2.6-2.1,4.7-4.7,4.7l0,0H14.9c-2.6,0-4.7-2.1-4.7-4.7
    V45.1C10.2,42.4,12.3,40.3,14.9,40.3L14.9,40.3"/>
</g>
<g>
  <path fill="red" d="M41.9,76.9c0,3.8-3.1,6.9-6.9,6.9c-3.8,0-6.9-3.1-6.9-6.9C28,73,31,70,34.9,70C38.8,70,41.9,73.1,41.9,76.9z"/>
</g>
<g>
  <g>
    <g>
      <path fill="#333333" d="M227.1,32.6c-11.7,0-23.3,0-35,0c0.1,1.4,0.1,2.1,0.1,3.5c12.3,0,24.7,0,37,0c0.8,1.3,1.2,2,2,3.4
        c7.6-2,11-3.1,17.3-5.1c-10-2-14.7-3.1-23.5-5.1C225.9,30.6,226.3,31.3,227.1,32.6z"/>
      <path fill="#333333" d="M191.8,24.1c10,0,20.1,0,30.1,0c0.8,1.3,1.2,2,2,3.4c6-2,8.7-3.1,13.4-5.1c-8.5-2-12.4-3.1-19.6-5.1
        c0.8,1.3,1.2,2,2,3.4c-9.4,0-18.8,0-28.1,0C191.7,22,191.8,22.7,191.8,24.1z"/>
      <path fill="#333333" d="M196,26.6c-10.5,0-21,0-31.6,0c0.6-1.3,0.9-2,1.5-3.4c-7.6,2-11.8,3.1-20.8,5.1c5.8,2,9,3.1,16.1,5.1
        c0.6-1.3,0.9-2,1.5-3.4c11.2,0,22.4,0,33.6,0C196.2,28.7,196.1,28,196,26.6z"/>
      <path fill="#333333" d="M168.3,18c8.9,0,17.8,0,26.7,0c-0.2-1.4-0.2-2.1-0.4-3.5c-8.2,0-16.5,0-24.7,0c0.6-1.3,0.9-2,1.5-3.4
        c-6.1,2-9.5,3.1-16.9,5.1c4.2,2,6.7,3.1,12.2,5.1C167.4,20.1,167.7,19.4,168.3,18z"/>
    </g>
  </g>
</g>
</svg>
);

const AndWidget = props => {
  const { model, engine } = props;
  const inputPorts = Object.values(model.getInputPorts());
  const portPositions = distributePorts(inputPorts.length);
  console.log(model)
  let light = 'mainLight-off'
  switch (model.status) {
    case 1:
      light = "mainLight-on"
      break;
    case 0:
      light = "mainLight-off"
      break;
    case 2:
      light = "mainLight-work"
  }
  return (
    <MenuProvider id="switch" storeRef={false} data={model}>
    <Wrapper selected={model.isSelected()}>
      <div className="portsSwitch8">
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
      </div>
      <svg 
      viewBox="0 0 402 116.8"
      height="50"
      width="180">
	 
      <g transform="translate(7.2017 262.91)">
        <path fill="#666666" d="M36.3-255.4h304.4l53.6,39.1l-400.8-0.9L36.3-255.4z"/>
      </g>
      <g transform="translate(7.2017 262.91)">
        <path fill="#808080" d="M-0.7-218.3h389c3.6,0,6.5,2.9,6.5,6.5v51.7c0,3.6-2.9,6.5-6.5,6.5h-389c-3.6,0-6.5-2.9-6.5-6.5v-51.7
          C-7.2-215.4-4.3-218.3-0.7-218.3"/>
      </g>
      <g transform="translate(1.9684e-8 12.37)">
        <path fill="#333333" d="M14.9,40.3h373.9c2.6,0,4.7,2.1,4.7,4.7l0,0v37.4c0,2.6-2.1,4.7-4.7,4.7l0,0H14.9c-2.6,0-4.7-2.1-4.7-4.7
          V45.1C10.2,42.4,12.3,40.3,14.9,40.3L14.9,40.3"/>
      </g>
      <g>
        <path className={light} d="M41.9,76.9c0,3.8-3.1,6.9-6.9,6.9c-3.8,0-6.9-3.1-6.9-6.9C28,73,31,70,34.9,70C38.8,70,41.9,73.1,41.9,76.9z"/>
      </g>
      <g>
        <g>
          <g>
            <path fill="#333333" d="M227.1,32.6c-11.7,0-23.3,0-35,0c0.1,1.4,0.1,2.1,0.1,3.5c12.3,0,24.7,0,37,0c0.8,1.3,1.2,2,2,3.4
              c7.6-2,11-3.1,17.3-5.1c-10-2-14.7-3.1-23.5-5.1C225.9,30.6,226.3,31.3,227.1,32.6z"/>
            <path fill="#333333" d="M191.8,24.1c10,0,20.1,0,30.1,0c0.8,1.3,1.2,2,2,3.4c6-2,8.7-3.1,13.4-5.1c-8.5-2-12.4-3.1-19.6-5.1
              c0.8,1.3,1.2,2,2,3.4c-9.4,0-18.8,0-28.1,0C191.7,22,191.8,22.7,191.8,24.1z"/>
            <path fill="#333333" d="M196,26.6c-10.5,0-21,0-31.6,0c0.6-1.3,0.9-2,1.5-3.4c-7.6,2-11.8,3.1-20.8,5.1c5.8,2,9,3.1,16.1,5.1
              c0.6-1.3,0.9-2,1.5-3.4c11.2,0,22.4,0,33.6,0C196.2,28.7,196.1,28,196,26.6z"/>
            <path fill="#333333" d="M168.3,18c8.9,0,17.8,0,26.7,0c-0.2-1.4-0.2-2.1-0.4-3.5c-8.2,0-16.5,0-24.7,0c0.6-1.3,0.9-2,1.5-3.4
              c-6.1,2-9.5,3.1-16.9,5.1c4.2,2,6.7,3.1,12.2,5.1C167.4,20.1,167.7,19.4,168.3,18z"/>
          </g>
        </g>
      </g>
      </svg>
         
    </Wrapper>
    </MenuProvider>
  );
};

export default AndWidget;
