import Debian10 from './Debian10/Debian10Register';
import Switch8 from './Switch8/Switch8Register';
import Router from './Router/RouterRegister';
import Win7 from './Win7/Win7Register';

const components = [
  Debian10,
  Switch8,
  Router,
  Win7
];

export default components;

export const groupedComponents = components.reduce(
  (acc, component) => {
    const group = acc.find(g => g.name === component.group);

    if (group) group.components.push(component);
    else acc.push({ name: component.group, components: [component] });

    return acc;
  },
  [],
);
