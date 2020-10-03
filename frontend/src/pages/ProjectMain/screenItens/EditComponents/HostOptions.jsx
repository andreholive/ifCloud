import React, {useEffect, useState} from 'react';
import {Content, Label, Input, PortsContent, IconButton} from './components';
import PortEdit from './PortEdit'

const HostOptions = ({host})=> {
    const [name, setName] = useState(host.configurations.NOME_DISP);
    useEffect(()=>{
        setName(host.configurations.NOME_DISP)
      },[host.configurations.NOME_DISP]);
    return (
    <Content>
        <Label>Nome do dispositivo</Label>
        <Input 
            placeholder="Nome do Dispositivo" 
            value={name}
            onChange={e => {setName(e.target.value)}}
        />
        <Label>Interfaces</Label>
        <PortsContent className='scroll1'>
        {Object.values(host.ports).map(port => (
        <PortEdit port={port}/>
        ))}
        </PortsContent>
    </Content>
    )
}

export default HostOptions