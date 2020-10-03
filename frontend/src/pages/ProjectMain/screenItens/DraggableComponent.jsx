import React from 'react';
import Tooltip from 'react-tooltip';

const engineStub = {
  registerListener: () => {},
  getCanvas: () => {},
  getPortCoords: () => ({
    getWidth: () => {},
    getHeight: () => {},
    getTopLeft: () => {},
  }),
  getModel: () => ({ isLocked: () => false }),
};

const DraggableComponent = ({
  close,
  component: { type, Widget, Model, Icon},
  configurations
  
}) => (
  <div
    draggable="true"
    onDragStart={event => {
      Tooltip.hide();
     
      event.dataTransfer.setDragImage(
        event.currentTarget.children[0],
        0,
        0,
      );

      event.dataTransfer.setData(
        'component',
        JSON.stringify({
          type,
          configurations,
        }),
      );

      requestAnimationFrame(() => {
        Tooltip.hide();
        close()
      });
    }}
    data-for="tooltip"
    data-tip={configurations.NOME_DISP}
    data-place="bottom"
  >
   <Icon />
  </div>
);

export default DraggableComponent;
