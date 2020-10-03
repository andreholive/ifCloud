import React from 'react';
import Tooltip from 'react-tooltip';

import styled from 'styled-components';

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

const getTooltip = (error, disabled) => {
  if (disabled) return '';
  if (error) return 'Check form errors';
  return 'Arraste para a área de Trabalho!';
};

const ErrorWidget = styled.div`
  border: 1px dashed var(--value-error);
  border-radius: 5px;
  width: 30px;
  height: 30px;
`;

const DraggableComponent = ({
  component: { type, Widget, Model },
  configurations,
  handleClose,
  error,
  disabled,
}) => (
  <div
    draggable={!error && !disabled}
    onDragStart={event => {
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
        handleClose();
      });
    }}
    data-for="tooltip"
    data-tip={getTooltip(error, disabled)}
    data-place="bottom"
  >
    {error ? (
      <ErrorWidget />
    ) : (
      <Widget
        engine={engineStub}
        model={new Model(type, configurations)}
      />
    )}
  </div>
);

export default DraggableComponent;
