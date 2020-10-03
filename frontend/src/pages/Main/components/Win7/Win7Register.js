import {Component}  from '../../core/Component';

import icon from './Win7Icon';
import model from './Win7Model';
import widget from './Win7Widget';
export default new Component({
  type: 'Win7',
  name: 'Windown 7 Host',
  description: 'Windows 7',
  group: 'Hosts',
  configurations: [
    {
      name: 'NOME_DISP',
      type: 'text',
      default: "Windows 7",
      label: 'Nome do Host',
    },
    {
      name: 'INPUT_PORTS_NUMBER',
      type: 'number',
      default: 1,
      label: 'Adaptadores Ethernet',
      min: 1,
      max: 4,
      validate(value) {
        if (value < this.min)
          return `Minimum input ports is ${this.min}`;
        if (value > this.max)
          return `Maximum input ports is ${this.max}`;
        return null;
      },
    },
    
  ],
  model,
  widget,
  icon,
});
