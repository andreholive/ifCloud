import React from 'react';


import { CanvasWidget } from '@projectstorm/react-canvas-core';

import styled from 'styled-components';

import DroppableLayer from './DroppableLayer';

const FullscreenCanvas = styled(CanvasWidget)`
  height: 100%;
  width: 100%;
`;

const Diagram = ({ engine }) => (
  
    <DroppableLayer
      handleComponentDrop={(...args) =>
        engine.handleComponentDrop(...args)
      }
      disabled={engine.isLocked()}
      //{...engine.update()}
    >
      <FullscreenCanvas engine={engine.getEngine()} className={engine.isLocked() ? 'locked' : 'unlocked'}/>
    </DroppableLayer>
  
);

export default Diagram;
