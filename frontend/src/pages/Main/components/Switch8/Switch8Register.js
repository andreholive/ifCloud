import {Component}  from '../../core/Component';

import icon from './Switch8Icon';
import model from './Switch8Model';
import widget from './Switch8Widget';
export default new Component({
  type: 'Switch',
  name: 'Switch 8 Portas',
  description: 'Switch 8 Portas',
  group: 'Infra-estrutura',
  configurations: [
    {
      name: 'NOME_DISP',
      type: 'text',
      default: "SWITCH",
      label: 'Nome do Switch',
    },
       
  ],
  model,
  widget,
  icon,
});
