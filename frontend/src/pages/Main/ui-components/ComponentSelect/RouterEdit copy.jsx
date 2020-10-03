import React, {useState, useEffect} from 'react';
import Modal from '../Modal/Modal';
import { Header, Content } from './ComponentLayout';
import styled from 'styled-components';
import './configrouter.scss';
import PortEdit from './PortEdit';

const Title = styled.div`
  width: 100%;
  height: 60px;
  font-size: 1.5em;
  margin: 0;
  align-self: center;
  text-align: center;
`;

const Projects = styled.div`

`;

const RouterEdit = ({
  model,
  handleClose,
  
}) => {
  const [interfaces, addInterfaces ] = useState([])
  let interval;
  useEffect(() => {
    setInterfaces()
    interval = setInterval(update, 1000)
    console.log('HANDLE')
  },[]);
  var arr = [];
  
  const [nome, setNome ] = useState(model.configurations.NOME_DISP)

  function update(){
    console.log(model.ports)
  }

  function close(){
    clearInterval(interval)
    handleClose()
  }

  function setInterfaces(){
    const ports = Object.values(model.ports)
    let index=0;
    ports.map(port => {
      let iface = {
        id: port.options.id,
        name: port.options.name,
        cidr: port.cidr,
        ip: port.ip,
        dhcp: port.dhcp,
        address: port.address,
        range: {
          start: port.range.start,
          end: port.range.end
        }
      }
      arr[index] = iface;
      index++;
    })
    addInterfaces(arr);
  }

  function addNewInterface(){
    model.functions.addInterface({});
    setInterfaces();
  }

  function getPort(id){
    function findPort(port) { 
        return port.options.id === id;
    }
    return Object.values(model.ports).find(findPort)
  }

  function remove(port){
    model.functions.removeInterface(port);
    setInterfaces();
  }

  function updateInterface(updates, portId){
    const updt = Object.values(updates)
    if(updt.length!=0){
      getPort(portId).functions.updatePort(updates);
    }
    handleClose()
  }

  function teste(){
    console.log('teste')
  }


return (
    <Modal>
      <Header>
       <Title>Configurar Roteador</Title>
      </Header>
        <Content>
          <label htmlFor="hostname">Hostname</label>
          <input id='hostname' className='edit_input'
              value={nome}
              onChange={e => setNome(e.target.value)}
          />
          <label>Interfaces</label>
          <div className="tabs">
          {interfaces.map(port => (
          <PortEdit
          key={port.id}
          port={port}
          updateInterface={updateInterface}
          removeInterface={remove}
          />
          ))
          }
          </div>
          <button onClick={addNewInterface}>Adicionar Interface</button>
          <button onClick={close}>Fechar</button>
      </Content>
      </Modal>
  );
};

export default RouterEdit;
