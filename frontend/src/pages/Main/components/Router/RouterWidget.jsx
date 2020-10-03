import React from 'react';
import { Port } from '../../core/Port/Port';
import './router.css'
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
	<path fill="red" d="M41.9,76.9c0,3.8-3.1,6.9-6.9,6.9c-3.8,0-6.9-3.1-6.9-6.9C28,73,31,70,34.9,70S41.9,73.1,41.9,76.9z"/>
</g>
<g>
	<g>
		<path fill="#333333" d="M190.9,25.9c-20.4-1.2-40.9-2.5-61.3-3.7c-0.5,1.1-0.7,1.6-1.2,2.7c-25.2,0-50.4-0.1-75.5-0.1
			c-1,0.9-1.5,1.3-2.5,2.2c25.7,0,51.4,0.1,77,0.1c-0.4,1-0.6,1.4-1.1,2.4C147.9,28.3,169.4,27.1,190.9,25.9z"/>
		<path fill="#333333" d="M260,25c-0.8-1.1-1.2-1.6-2-2.7c-20.1,1.3-40.2,2.5-60.3,3.6c21.8,1.3,43.7,2.5,65.5,3.8
			c-0.7-1-1-1.5-1.7-2.4c25.7,0,51.4,0.1,77,0.1c-1.2-0.9-1.9-1.4-3.1-2.3C310.3,25,285.1,25,260,25z"/>
		<path fill="#333333" d="M181.7,24.1c8.7,0,13.1,0,21.8,0c-0.7-3.1-1-4.6-1.7-7.7c9.9,0,14.8,0,24.7,0c-14.5-2.6-21.4-3.8-34.3-6.4
			c-12.2,2.5-18.7,3.8-32.5,6.3c8.8,0,13.1,0,21.9,0C181.5,19.5,181.6,21,181.7,24.1z"/>
		<path fill="#333333" d="M204.2,27.3c-9,0-13.5,0-22.4,0c0.1,3.1,0.1,4.6,0.2,7.7c-10.3,0-15.4,0-25.7,0
			c13.4,2.3,26.8,4.3,40.2,6.4c12.8-2,25.7-4.1,38.5-6.3c-11.6,0-17.4,0-29-0.1C205.2,31.9,204.9,30.4,204.2,27.3z"/>
	</g>
</g>
<path fillRule="evenodd" fill="#FF7D08" d="M346.9,69.8L346.9,69.8c0.7,0,1.3,0.1,1.9,0.2c2-4.5,6.4-7.6,11.6-7.6
	c6.3,0,11.6,4.7,12.5,10.7c4,0.5,7.2,4,7.2,8.2l0,0c0,4.6-3.7,8.3-8.3,8.3c-14.9,0-13.3,0.1-25.3,0c-5.2-0.1-9.5-4.8-9.5-9.9l0,0
	C336.9,74.3,341.4,69.8,346.9,69.8L346.9,69.8z"/>
</svg>
);

const RouterWidget = props => {
	const { model, engine } = props;
	 let {status}=model.configurations
  const inputPorts = Object.values(model.getInputPorts());
  const portPositions = distributePorts(inputPorts.length);
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
	<MenuProvider id="router" storeRef={false} data={model}>
    <Wrapper selected={model.isSelected()}>
      <div className="portsRouter">
      {inputPorts.map((port, i) => (
        <PositionedPort
          key={port.getName()}
		  name={port.getName()}
		  netid={port.getNetwork()}
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
	<path className={light} d="M41.9,76.9c0,3.8-3.1,6.9-6.9,6.9c-3.8,0-6.9-3.1-6.9-6.9C28,73,31,70,34.9,70S41.9,73.1,41.9,76.9z"/>
</g>
<g>
	<g>
		<path fill="#333333" d="M190.9,25.9c-20.4-1.2-40.9-2.5-61.3-3.7c-0.5,1.1-0.7,1.6-1.2,2.7c-25.2,0-50.4-0.1-75.5-0.1
			c-1,0.9-1.5,1.3-2.5,2.2c25.7,0,51.4,0.1,77,0.1c-0.4,1-0.6,1.4-1.1,2.4C147.9,28.3,169.4,27.1,190.9,25.9z"/>
		<path fill="#333333" d="M260,25c-0.8-1.1-1.2-1.6-2-2.7c-20.1,1.3-40.2,2.5-60.3,3.6c21.8,1.3,43.7,2.5,65.5,3.8
			c-0.7-1-1-1.5-1.7-2.4c25.7,0,51.4,0.1,77,0.1c-1.2-0.9-1.9-1.4-3.1-2.3C310.3,25,285.1,25,260,25z"/>
		<path fill="#333333" d="M181.7,24.1c8.7,0,13.1,0,21.8,0c-0.7-3.1-1-4.6-1.7-7.7c9.9,0,14.8,0,24.7,0c-14.5-2.6-21.4-3.8-34.3-6.4
			c-12.2,2.5-18.7,3.8-32.5,6.3c8.8,0,13.1,0,21.9,0C181.5,19.5,181.6,21,181.7,24.1z"/>
		<path fill="#333333" d="M204.2,27.3c-9,0-13.5,0-22.4,0c0.1,3.1,0.1,4.6,0.2,7.7c-10.3,0-15.4,0-25.7,0
			c13.4,2.3,26.8,4.3,40.2,6.4c12.8-2,25.7-4.1,38.5-6.3c-11.6,0-17.4,0-29-0.1C205.2,31.9,204.9,30.4,204.2,27.3z"/>
	</g>
</g>
<path fillRule="evenodd" fill="#FF7D08" d="M346.9,69.8L346.9,69.8c0.7,0,1.3,0.1,1.9,0.2c2-4.5,6.4-7.6,11.6-7.6
	c6.3,0,11.6,4.7,12.5,10.7c4,0.5,7.2,4,7.2,8.2l0,0c0,4.6-3.7,8.3-8.3,8.3c-14.9,0-13.3,0.1-25.3,0c-5.2-0.1-9.5-4.8-9.5-9.9l0,0
	C336.9,74.3,341.4,69.8,346.9,69.8L346.9,69.8z"/>
</svg>
         
    </Wrapper>
	</MenuProvider>
  );
};

export default RouterWidget;
