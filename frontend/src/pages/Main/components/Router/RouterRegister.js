import {Component}  from '../../core/Component';

import icon from './RouterIcon';
import model from './RouterModel';
import widget from './RouterWidget';

export default new Component({
  type: 'Router',
  name: 'Router',
  description: 'Router',
  group: 'Infra-estrutura',
  configurations: [
    {
      name: 'NOME_DISP',
      type: 'text',
      default: "Router",
      label: 'Nome do Roteador',
    },
              
  ],
  model,
  widget,
  icon,
});
