import React, { Component } from 'react';
import Tooltip from 'react-tooltip';
import { useHistory } from 'react-router-dom';
import components from './components'
import {groupedComponents} from './components'
import DiagramEngine from './core/Diagram/DiagramEngine';
import Diagram from './core/Diagram/Diagram';
import RightMenu from '../RightMenu'

import socketIOClient from 'socket.io-client';



import {
  SimulationControlButtons,
  ComponentSelectButton,
  ComponentSelect,
  ComponentEdit,
  ContextMenus,
  LogoState,
  RouterEdit,
} from './ui-components';
import './index.css';

const NOTIFICATION_TYPES = {
	INFO: 'info',
	SUCCESS: 'success',
	WARNING: 'warning',
	DANGER: 'danger'
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isComponentSelectOpen: false,
      isComponentEditOpen: false,
      isComponentEditRouterOpen: false,
      componentEdit: null,
    };
    this.userId = localStorage.getItem("userId");
    this.project_id=this.props.match.params.id;
    this.loaded = false;
    this.socket = socketIOClient(`http://192.168.0.199:3333?token=${localStorage.getItem("scopedToken")}&user=${this.userId}&project_id=${this.project_id}`, {
      reconnectionAttempts: 5,
      
    })
    this.socket.on('connect', () => {
      this.loadHandler();
    });

    this.socket.on('reconnect_error', (error) => {
      this.notify('WARNING', "Conexão com o servidor perdida, tentando reconectar...")
      console.log("ERRO") // disparar uma trava para evitar alterações
    });
    this.socket.on('reconnect_attempt', (attemptNumber) => {
      this.loadHandler();
    });
    this.socket.on('reconnecting', (tentativa) => {
      console.log("reconectando...", tentativa);
    });
    this.socket.on('reconnect_failed', (error) => {
      this.notify('DANGER', "Impossível Reconectar ao Servidor")
      console.log("falha ao conectar")
    });
    this.socket.on('reconnect', (error) => {
      this.notify('SUCCESS', "Conectado!")
      console.log("falha ao conectar")
    });
    
    this.diagram = new DiagramEngine(
      components,
      this.areShortcutsAllowed,
      this.notify,
      this.removeNotification,
      this.socket
    );
  }

  componentDidMount() {
    window.addEventListener('keydown', this.shortcutHandler);
    window.addEventListener('beforeunload', this.unloadHandler);//usar para desligar todas as maquinas

  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.shortcutHandler);
    window.removeEventListener('beforeunload', this.unloadHandler); //usar para desligar todas as maquinas

  }

  areShortcutsAllowed = () => {
    const { isComponentSelectOpen, isComponentEditOpen } = this.state;
    return !(isComponentSelectOpen || isComponentEditOpen);
  };

  shortcutHandler = event => {
    const { ctrlKey, shiftKey, code } = event;

    if (!this.areShortcutsAllowed()) return;

    
    if (ctrlKey && code === 'KeyA') {
      event.preventDefault();
      this.showAddComponent();
    }

    // Component configuration
    if (ctrlKey && code === 'KeyE') {
      event.preventDefault();
      const selectedNodes = this.diagram.getSelectedNodes();
      if (selectedNodes.length !== 1) return;
      const node = selectedNodes[0];
      this.showEditComponent(node);
    }
   
  };

  isProjectEmpty = project => {
    if (!project) return true;

    return Object.keys(project.models).length === 0;
  };

  mountDiagram = project => {
    let diagram = {
      id: project.projectId,
      locked: false,
      offsetX: 0,
      offsetY: 0,
      zoom: 100,
      gridSize: 15,
      layers:[
          {
              id:"1",
              type:"diagram-links",
              isSvg:true,
              transformed:true,
              models: project.links
          },
          {
              id:"2",
              type:"diagram-nodes",
              isSvg:false,
              transformed:true,
              models: project.models
          }
      ]
  }
  return diagram;
  }

  login(){
    const history = useHistory();
    history.push('/');
  }

  loadHandler = () => {
    
    this.socket.on(this.project_id, (data) => {
    if (this.isProjectEmpty(data.project)) return;
    if(this.loaded)return
    const diagram = this.mountDiagram(data.project)
    this.diagram.load(diagram);
    this.loaded = true;
    });
    this.socket.on(this.userId, (data) => {
      if(data.status == 401){
          this.login()
      }
    });
  }
  
  shouldWarnUnload = (currentCircuit, lastSavedCircuit) => {
    if (this.isCircuitEmpty(currentCircuit)) return false;

    return (
      JSON.stringify(lastSavedCircuit.layers) !==
      JSON.stringify(currentCircuit.layers)
    );
  };

  unloadHandler = event => {
    // função para desligar as maquinas antes de sair
  };

  showAddComponent = () =>
    this.setState({
      isComponentSelectOpen: true,
    });

  hideAddComponent = () =>
    this.setState({
      isComponentSelectOpen: false,
    });

  showEditComponent = componentEdit => {
    if(componentEdit.options.type === 'Router'){
      console.log(componentEdit)
      this.showEditRouterComponent(componentEdit);
    }else{
    this.diagram.clearSelection();
    this.setState({
      isComponentEditOpen: true,
      componentEdit,
    });
  }
  };

  showEditRouterComponent = componentEdit => {
    this.diagram.clearSelection();
    this.setState({
      isComponentEditRouterOpen: true,
      componentEdit,
    });
  };

  hideEditComponent = () =>
    this.setState({
      isComponentEditOpen: false,
      componentEdit: null,
    });

  hideEditRouterComponent = () =>
    this.setState({
      isComponentEditRouterOpen: false,
      componentEdit: null,
    });

  notify(type, text) {
      // create the DIV and add the required classes
      const newNotification = document.createElement('div');
      newNotification.classList.add('notification', `notification-${NOTIFICATION_TYPES[type]}`);
  
      const innerNotification = `
      <strong>${type}:</strong> ${text}
    `;
  
      // insert the inner elements
      newNotification.innerHTML = innerNotification;
      document.getElementById('notifications').append(newNotification)
      setTimeout(() => {
        this.removeNotification(newNotification);
      }, 5000);
  }

  removeNotification(notification) {
    notification.classList.add('hide');
    setTimeout(() => {
      document.getElementById('notifications').removeChild(notification);
    }, 500);
  }

  render() {
    const {
      isComponentSelectOpen,
      isComponentEditOpen,
      componentEdit,
      isComponentEditRouterOpen,
      
    } = this.state;
    return (
        <div className='diagram'>
        <LogoState/>

        <div id="notifications">
          
        </div>

        <RightMenu />
        
        <ComponentSelect
          isOpen={isComponentSelectOpen}
          groups={groupedComponents}
          handleClose={this.hideAddComponent}
          handleComponentDrop={this.diagram.handleComponentDrop}
        />

        <ComponentEdit
          isOpen={isComponentEditOpen}
          components={components}
          component={componentEdit}
          handleClose={this.hideEditComponent}
          handleComponentEdit={this.diagram.handleComponentEdit}
        />

        <RouterEdit    
          model={componentEdit}
          handleClose={this.hideEditRouterComponent}
          isOpen={isComponentEditRouterOpen}
        />

        <Diagram engine={this.diagram} />

        <Tooltip id="tooltip" globalEventOff="click" />

        <ContextMenus
          duplicateSelected={this.diagram.duplicateSelected}
          cutSelected={this.diagram.cutSelected}
          copySelected={this.diagram.copySelected}
          pasteSelected={this.diagram.pasteSelected}
          deleteSelected={this.diagram.deleteSelected}
          undo={this.diagram.undo}
          redo={this.diagram.redo}
          zoomIn={this.diagram.zoomIn}
          zoomOut={this.diagram.zoomOut}
          configureComponent={this.showEditComponent}
          configureRouterComponent={this.showEditRouterComponent}
        />
      </div>
    );
  }
}
