import React from 'react';

import ComponentContextMenu from './ComponentContextMenu';
import DiagramContextMenu from './DiagramContextMenu';
import RouterContextMenu from './RouterContextMenu';
import SwitchContextMenu from './SwitchContextMenu';
import HostContextMenu from './HostContextMenu';
import PortContextMenu from './PortContextMenu';

import 'react-contexify/dist/ReactContexify.min.css';

const ContextMenus = ({
  duplicateSelected,
  cutSelected,
  copySelected,
  pasteSelected,
  deleteSelected,
  undo,
  redo,
  zoomIn,
  zoomOut,
  configureComponent,
}) => (
  <>
    <DiagramContextMenu
      pasteSelected={pasteSelected}
      undo={undo}
      redo={redo}
      zoomIn={zoomIn}
      zoomOut={zoomOut}
    />
    <ComponentContextMenu
      duplicateSelected={duplicateSelected}
      cutSelected={cutSelected}
      copySelected={copySelected}
      pasteSelected={pasteSelected}
      deleteSelected={deleteSelected}
      undo={undo}
      redo={redo}
      zoomIn={zoomIn}
      zoomOut={zoomOut}
      configureComponent={configureComponent}
    />
    <RouterContextMenu
      configureComponent={configureComponent}
    />
    <SwitchContextMenu
      configureComponent={configureComponent}
    />
    <HostContextMenu
      configureComponent={configureComponent}
    />
    <PortContextMenu
      configureComponent={configureComponent}
    />
  </>
);

export default ContextMenus;
