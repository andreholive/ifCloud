import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTerminal, faTools, faPowerOff, faSync, faTrashAlt} from "@fortawesome/free-solid-svg-icons";

import styled from 'styled-components';

const engineStub = {
  registerListener: () => {},
  getCanvas: () => {},
  getPortCoords: () => ({
    getWidth: () => {},
    getHeight: () => {},
    getTopLeft: () => {},
  }),
  getModel: () => ({ isLocked: () => false }),
};


const DeviceArea = styled.div`
  display: flex;  
  align-items: center;
  -ms-flex-pack: center;
  justify-content: center;
  width: 450px;
  height: 201px;
  margin: 0 auto;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.3);
  overflow: hidden;
  background-color: #8fa1ce;
`;

const Title = styled.h1`
  flex-grow: 1;
  font-size: 1.5em;
  margin: 0;
  align-self: center;
  text-align: center;
  color: #FFF;
`;

const Header = styled.div`
  margin-top: 7px;
  align-content: space-between;
  position: absolute;
  width: 100%;
`;

const Menu = styled.div`
  margin-top: 7px;
  position: absolute;
  width: fit-content;
  height: 36px;
  top: 146px;
  background-color: #FFF;
  border-radius: 4px 4px 14px 14px;
  box-shadow: 0 1px 4px -1px rgba(18, 22, 33, .24);
`;

const MenuButtons = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 12px;
  list-style: none;
  display: grid;
  position: relative;
  overflow: hidden;
  text-align: center;
  grid-template-columns: repeat(4, minmax(0, 1fr));
`;

const Button = styled.button`
  align-items: center;
  height: 36px;
  justify-content: center;
  display: flex;
  width: 36px;
  cursor: pointer;
  transition: all .3s linear;
  border: none;
  background: transparent;
  ${props => {
    if(props.status == 2 || props.status == 0 && !props.power) return `color: #ccc;`;
    return `color: black;`;
  }}
  opacity: 1;
  :hover {
    color: #8fa1ce;
    cursor: pointer;
  }
`;

const VisualDevice = ({
  device,
  close
}) => {
  const {Widget, type, Model} = device.engine.nodeFactories.factories[device.options.type];
  const model = new Model(type, device.configurations)
  const {functions} = device;
  model.status = device.status;
  model.ports = device.ports;

  const [status, setStatus] = useState(device.status);
  
  useEffect(()=>{
    setStatus(device.status)
  },[device.status])

  return (
    <>
    <Header>
        <Title>{model.configurations.NOME_DISP}</Title>
    </Header>
    <DeviceArea className='deviceBackground'>
    <Widget
        engine={engineStub}
        model={model}
        lockMenu={true}
      />
      <Menu>
        <MenuButtons>
          <Button onClick={() => {functions.terminal()}} status={status} disabled={status==0 || status==2}>
            <FontAwesomeIcon icon={faTerminal} />
          </Button>
          <Button status={status} disabled={status==2} power={true} onClick={() => {
                if(status==1)functions.powerOff();
                if(status==0)functions.powerOn();
              }}>
            <FontAwesomeIcon icon={faPowerOff} />
          </Button>
          <Button onClick={() => {functions.reboot()}} status={status} disabled={status==0 || status==2}>
            <FontAwesomeIcon icon={faSync} />
          </Button>
          <Button onClick={() => {
              close()
              functions.delete();
            }}  status={status} power={true} disabled={status==2}>
            <FontAwesomeIcon icon={faTrashAlt}/>
          </Button>
        </MenuButtons>
      </Menu>
    </DeviceArea>
    </>
  )
};

export default VisualDevice;
