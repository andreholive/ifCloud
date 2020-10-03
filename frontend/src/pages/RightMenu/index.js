import React, {Component} from 'react';
import './teste.css'
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import {groupedComponents} from '../Main/components'
import ComponentSelect from '../Main/ui-components/ComponentSelect/ComponentSelect'



const Container = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;

  z-index: 2;
`;
const Button = styled.button.attrs(({ ...props }) => ({
    ...props,
    type: 'button',
  }))`
    border: none;
    border-radius: 100%;
  
    background: #737fc7;
    box-shadow: inset 0 0 10px #737fc7;
  
    width: 60px;
    height: 60px;
    margin: 16px;
  
    font-size: 2em;
    line-height: 1em;
    color: white;
  
    transition: 0.5s ease-in-out;
  
    &:disabled {
      opacity: 10%;
      cursor: not-allowed;
      background: gray;
      box-shadow: inset 0 0 10px black;
    }
  `;

class MenuLateral extends Component{

    constructor(isOpen, handleClose, handleComponentDrop){
        super()
        this.handleClose = handleClose
        this.handleComponentDrop = handleComponentDrop
        this.state = {
            open: true,
            isComponentSelectOpen: isOpen
            
          };
    }

    hideAddComponent = () =>
    this.setState({
      open: false,
    });
    getInitialState() {
     return { open: false };
     
    }
    open(a) {
        a.setState({open: !a.state.open})
    }
    
  componentDidMount(){
  this.setState({open: false})
  }

render(){
    return(
        <>
        <Container>
        <Button
        data-for="tooltip"
        data-tip={!this.state.open 
          ?"Adicionar um Dispositivo":"Fechar"}
        data-place="left"
            className={this.state.open 
              ? "menu-toggle close-button" 
              : "menu-toggle "}
            onClick={()=>this.open(this)}
          > <FontAwesomeIcon icon={faPlus}/>
          </Button>
        </Container>
        <div 
            className={this.state.open 
              ? "menu-wrapper menu-open" 
              : "menu-wrapper"}
        >
        <ComponentSelect
          isOpen={true}
          groups={groupedComponents}
          handleClose={this.hideAddComponent}
          handleComponentDrop={this.handleComponentDrop}
        />
        </div>
        
       </>
    )
}
}

export default MenuLateral;