import React from 'react';
import styled from 'styled-components';

import ComponectSearch from './ComponentSearch'
import {groupedComponents} from '../../Main/components'

import OptionsMenu from './EditComponents/OptionsMenu'

const ContainerMenu = styled.div`
    position: absolute;
    right: ${props => props.isOpen ? '0' : '-450px'};
    top: 0;
    height: 100vh;
    width: 450px;
    background: #FFF;
    -webkit-box-shadow: -8px 0px 14px -7px rgba(0,0,0,0.75);
    -moz-box-shadow: -8px 0px 14px -7px rgba(0,0,0,0.75);
    box-shadow: -8px 0px 14px -7px rgba(0,0,0,0.75);
    transition: all .3s ease-in-out;
    
`;

export default function MainMenu({isOpen, close, device}){
    return (
        <ContainerMenu isOpen={isOpen}>
        {!device ?
        <ComponectSearch
          groups={groupedComponents}
          isOpen={isOpen}
          close={close}
        />
        : <OptionsMenu device={device} close={close}/>}
        </ContainerMenu>
    )

}