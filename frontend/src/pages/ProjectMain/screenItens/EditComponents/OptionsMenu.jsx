import React, {useState, useEffect} from 'react';
import Tooltip from 'react-tooltip';

import RouterOptions from './RouterOptions';
import HostOptions from './HostOptions';
import VisualDevice from './VisualDevice'

const OptionsMenu = ({
  device,
  close
}) => {
  const {Widget, type, Model} = device.engine.nodeFactories.factories[device.options.type];
  const model = new Model(type, device.configurations)
  
  useEffect(Tooltip.rebuild);

  model.status = device.status;
  model.ports = device.ports;

  console.log(device)

  return (
    <>
    <VisualDevice device={device} close={close}/>
    {model.configurations.tipo == 'Router' ? 
    <RouterOptions router={device} /> : null
    }
    {model.configurations.tipo == 'Host' ? 
    <HostOptions host={device} /> : null
    }
    </>
  )
};

export default OptionsMenu;
