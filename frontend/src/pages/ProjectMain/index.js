import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import components from '../Main/components'
import Tooltip from 'react-tooltip';

import DiagramEngine from '../Main/core/Diagram/DiagramEngine';
import Diagram from '../Main/core/Diagram/Diagram';
import ContextMenus from './screenItens/ContextMenus/ContextMenus'

import socketIOClient from 'socket.io-client';

import Logo from './screenItens/Logo';
import Menu from './screenItens/Menu';
import Notifications from './Notifications';
import RouterEdit from './screenItens/ui-components/RouterEdit';

import './index.css'

const project_id = localStorage.getItem("projectID");
const token = localStorage.getItem("scopedToken");
const userId = localStorage.getItem("userId");

const socket = socketIOClient(`http://localhost:3333?token=${token}&user=${userId}&project_id=${project_id}`, {
    reconnectionAttempts: 5,
});

let diagram = false;

function getDiagram(areShortcutsAllowed, notify, removeNotification, openCloseMenu){
    if(!diagram){
        diagram = new DiagramEngine(components, areShortcutsAllowed, notify, removeNotification, socket, openCloseMenu);
    }
}

export default function Profile(){

    getDiagram(
        areShortcutsAllowed,
        notify,
        removeNotification,
        openCloseMenu
    );
    const [notifications, setNotifications] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [deviceEdit, setDeviceEdit] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    
    useEffect(() => { 
        startSocket();   
    },[]);

    let loaded = false;

    function startSocket(){
        socket.on('connect', () => {
            loadHandler();
          });
    
        socket.on(userId, (data) => {
            if(data.status == 401){
                window.open('/');
            }
        });

        socket.on('reconnect_attempt', (attemptNumber) => {
            notify('warning', "Conexão com o servidor perdida, tentando reconectar...");
            diagram.setLocked(true)
        });

        socket.on('reconnect', () => {
            diagram.setLocked(false)
            loadHandler()
          });

        socket.on('reconnect_failed', () => {
            notify('danger', "Impossível Reconectar ao Servidor")
          });
    }

    function areShortcutsAllowed(){
        return !menuOpen;
      };

    function isProjectEmpty(project){
        if (!project) return true;
    
        return Object.keys(project.models).length === 0;
    };

    function openCloseMenu(device){
        if(menuOpen){
            setDeviceEdit(false)
            setMenuOpen(false);
            return
        }
        if(device){
        setDeviceEdit(device)
        setMenuOpen(true);
        return
        }
        setMenuOpen(true);
    }

    function mountProject(project){
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

    function loadHandler(){
        socket.emit('login', null);
        if(!loaded){
        socket.on(project_id, (data) => {
            console.log(data)
        if (isProjectEmpty(data.project)) return;
        if(!loaded){
        const project = mountProject(data.project)
        diagram.load(project);
        loaded = true;
        }
        notify('success', "Conectado!");
        })
        };
    }

    function getId(){
		var randomized = Math.ceil(Math.random() * Math.pow(10,10));
		var digito = Math.ceil(Math.log(randomized));
		while(digito > 10){
			digito = Math.ceil(Math.log(digito));
		}
		var id = randomized + '-' + digito;
		return id;
	}

    function notify(type, text) {
        const newNotification = {type, text, id:getId()}
        setNotifications(notifications => [...notifications, newNotification]);
        setTimeout(() => {
            removeNotification(newNotification)
    }, 5000);
    }

    function removeNotification(notification) {
        const not = document.getElementById(notification.id);
        if(not){
        not.classList.add('hide');
        setTimeout(() => {
            notificationPop(notification)
        }, 500);
        }
    }

    function notificationPop(notification){
        let arr = [...notifications];
        arr.pop(notification)
        setNotifications([...notifications, ...arr]);
    }

    function showEditComponent(componentEdit){
        diagram.clearSelection();
        setDeviceEdit(componentEdit);
        setOpenEdit(true)
    };

    function closeEdit(){
        setDeviceEdit('')
        setOpenEdit(false)
    };

    function showEditDevice(device){
        diagram.clearSelection();
        setOpenEdit(true)
    };
    
    return (
        <div className='diagram'>
        <Logo/>
        <Notifications notifications={notifications} />
        {diagram ? <Diagram engine={diagram} /> : null}
        <RouterEdit    
          model={deviceEdit}
          handleClose={closeEdit}
          isOpen={openEdit}
        />
        <Tooltip id="tooltip" globalEventOff="click" />
        <ContextMenus
            configureComponent={showEditComponent}
            configureRouterComponent={showEditDevice}
        />
        <Menu isOpen={menuOpen} setOpen={openCloseMenu} device={deviceEdit}/>
        </div>
    )

}