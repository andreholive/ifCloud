import React, {useEffect, useState} from 'react';
import {Content, Label, Input, PortsContent, IconButton} from './components';
import PortEdit from './PortEdit'

const RouterOptions = ({router})=> {
    const [name, setName] = useState(router.configurations.NOME_DISP);
    useEffect(()=>{
        setName(router.configurations.NOME_DISP)
      },[router.configurations.NOME_DISP]);
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
        {Object.values(router.ports).map(port => (
        <PortEdit port={port}/>
        ))}
        </PortsContent>
        <IconButton 
        onClick={() => {router.functions.addInterface()}}
        data-for="tooltip"
        data-tip='Adicionar Interface'
        data-place="bottom" 
        disabled={true}/>
    </Content>
    )
}

export default RouterOptions