import React from 'react';

import styled from 'styled-components';

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
`;

const Window = styled.div`
  width: 60vw;
  max-height: 80vh;
  max-width: 600px;
  background: white;
  border: 1px solid black;
  border-radius: 25px;
  z-index: 4;
  overflow: hidden;
`;

const Modal = ({ children }) => (
  <Overlay>
    <Window>{children}</Window>
  </Overlay>
);

export default Modal;
