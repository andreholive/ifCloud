import React, { useState, useEffect, useCallback } from 'react';
import ComponentConfiguration from './ComponentConfiguration';
import ComponentSearch from './ComponentSearch';

const closeOnEsc = (
  { code },
  { handleClose, setSelectedComponent },
) => {
  if (code !== 'Escape') return;
  handleClose();
  setSelectedComponent(null);
};

const ComponentSelect = ({
  isOpen,
  groups,
  handleClose,
  handleComponentDrop,
}) => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const callback = useCallback(
    event => closeOnEsc(event, { handleClose, setSelectedComponent }),
    [handleClose],
  );

  useEffect(() => {
    window.addEventListener('keydown', callback);
    return () => window.removeEventListener('keydown', callback);
  });

  if (!isOpen) return null;

  return (
    <>
      {selectedComponent ? (
        <ComponentConfiguration
          handleClose={() => {
            handleClose();
            setSelectedComponent(null);
          }}
          handleSubmit={handleComponentDrop}
          handleBack={() => setSelectedComponent(null)}
          component={selectedComponent}
        />
      ) : (
        <ComponentSearch
          handleClose={handleClose}
          handleComponentSelect={setSelectedComponent}
          groups={groups}
        />
      )}
    </>
  );
};

export default ComponentSelect;
