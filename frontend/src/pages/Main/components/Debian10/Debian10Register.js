import {Component}  from '../../core/Component';

import icon from './Debian10Icon';
import model from './Debian10Model';
import widget from './Debian10Widget';
export default new Component({
  type: 'Debian10Server',
  name: 'Debian Host',
  description: 'Logic "and" gate',
  group: 'Hosts',
  configurations: [
    {
      name: 'NOME_DISP',
      type: 'text',
      default: "Debian",
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
