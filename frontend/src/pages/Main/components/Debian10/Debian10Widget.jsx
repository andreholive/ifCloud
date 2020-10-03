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

  width: 180px;
  height: 70px;
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
<svg viewBox="0 0 714 205" width="150" height="60">
<rect y="42" width="714" height="121" rx="15.61" fill="#aca8a9"/>
<rect x="28.25" width="660" height="205" rx="29.57" fill="#eaeaea"/>
<rect x="43.75" y="13.5" width="629" height="178" rx="20.32" fill="#383a39"/>
<circle cx="104.5" cy="69.5" r="10.5" fill="#e1e1e1"/>
<circle cx="139.5" cy="69.5" r="10.5" fill="#e1e1e1"/>
<circle cx="174.5" cy="69.5" r="10.5" fill="#e1e1e1"/>
<circle cx="209.5" cy="69.5" r="10.5" fill="#e1e1e1"/>
<circle cx="244.5" cy="69.5" r="10.5" fill="#e1e1e1"/>
<circle cx="279.5" cy="69.5" r="10.5" fill="#e1e1e1"/>
<circle cx="314.5" cy="69.5" r="10.5" fill="#e1e1e1"/>
<circle cx="104.5" cy="102.5" r="10.5" fill="#e1e1e1"/>
<circle cx="139.5" cy="102.5" r="10.5" fill="#e1e1e1"/>
<circle cx="174.5" cy="102.5" r="10.5" fill="#e1e1e1"/>
<circle cx="209.5" cy="102.5" r="10.5" fill="#e1e1e1"/>
<circle cx="244.5" cy="102.5" r="10.5" fill="#e1e1e1"/>
<circle cx="279.5" cy="102.5" r="10.5" fill="#e1e1e1"/>
<circle cx="314.5" cy="102.5" r="10.5" fill="#e1e1e1"/>
<circle cx="104.5" cy="135.5" r="10.5" fill="#e1e1e1"/>
<circle cx="139.5" cy="135.5" r="10.5" fill="#e1e1e1"/>
<circle cx="174.5" cy="135.5" r="10.5" fill="#e1e1e1"/>
<circle cx="209.5" cy="135.5" r="10.5" fill="#e1e1e1"/>
<circle cx="244.5" cy="135.5" r="10.5" fill="#e1e1e1"/>
<circle cx="279.5" cy="135.5" r="10.5" fill="#e1e1e1"/>
<circle cx="314.5" cy="135.5" r="10.5" fill="#e1e1e1"/>
<rect x="369" y="65.62" width="123" height="19" rx="9.5" fill="#242424"/>
<rect x="369" y="94.62" width="123" height="19" rx="9.5" fill="#242424"/>
<rect x="369" y="122.62" width="123" height="19" rx="9.5" fill="#242424"/>
<circle cx="583" cy="103.63" r="19" fill="red"/>
</svg>
);

const Debian10Widget = props => {
  const { model, engine } = props;
  let {status}=model;
  const inputPorts = Object.values(model.getInputPorts());
  const portPositions = distributePorts(inputPorts.length);
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
      

<svg viewBox="0 0 714 205" width="350" height="60">
<rect y="42" width="714" height="121" rx="15.61" fill="#aca8a9"/>
<rect x="28.25" width="660" height="205" rx="29.57" fill="#eaeaea"/>
<rect x="43.75" y="13.5" width="629" height="178" rx="20.32" fill="#383a39"/>
<circle cx="104.5" cy="69.5" r="10.5" fill="#e1e1e1"/>
<circle cx="139.5" cy="69.5" r="10.5" fill="#e1e1e1"/>
<circle cx="174.5" cy="69.5" r="10.5" fill="#e1e1e1"/>
<circle cx="209.5" cy="69.5" r="10.5" fill="#e1e1e1"/>
<circle cx="244.5" cy="69.5" r="10.5" fill="#e1e1e1"/>
<circle cx="279.5" cy="69.5" r="10.5" fill="#e1e1e1"/>
<circle cx="314.5" cy="69.5" r="10.5" fill="#e1e1e1"/>
<circle cx="104.5" cy="102.5" r="10.5" fill="#e1e1e1"/>
<circle cx="139.5" cy="102.5" r="10.5" fill="#e1e1e1"/>
<circle cx="174.5" cy="102.5" r="10.5" fill="#e1e1e1"/>
<circle cx="209.5" cy="102.5" r="10.5" fill="#e1e1e1"/>
<circle cx="244.5" cy="102.5" r="10.5" fill="#e1e1e1"/>
<circle cx="279.5" cy="102.5" r="10.5" fill="#e1e1e1"/>
<circle cx="314.5" cy="102.5" r="10.5" fill="#e1e1e1"/>
<circle cx="104.5" cy="135.5" r="10.5" fill="#e1e1e1"/>
<circle cx="139.5" cy="135.5" r="10.5" fill="#e1e1e1"/>
<circle cx="174.5" cy="135.5" r="10.5" fill="#e1e1e1"/>
<circle cx="209.5" cy="135.5" r="10.5" fill="#e1e1e1"/>
<circle cx="244.5" cy="135.5" r="10.5" fill="#e1e1e1"/>
<circle cx="279.5" cy="135.5" r="10.5" fill="#e1e1e1"/>
<circle cx="314.5" cy="135.5" r="10.5" fill="#e1e1e1"/>
<rect x="369" y="65.62" width="123" height="19" rx="9.5" fill="#242424"/>
<rect x="369" y="94.62" width="123" height="19" rx="9.5" fill="#242424"/>
<rect x="369" y="122.62" width="123" height="19" rx="9.5" fill="#242424"/>
<circle cx="583" cy="103.63" r="19" className={light}/>
</svg>
    </Wrapper>
    </MenuProvider>
  );
};

export default Debian10Widget;
