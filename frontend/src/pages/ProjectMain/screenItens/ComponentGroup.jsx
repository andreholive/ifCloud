import React, { useState } from 'react';

import styled from 'styled-components';

import { Chevron } from './Icons';

import DraggableComponent from './DraggableComponent';

const DragArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 130px;
  margin: 0 auto;
  box-shadow: ${props =>
    `inset 0 0 20px rgba(${props.error ? 255 : 0}, 0, 0, 0.3)`};
  border-radius: 10px;
  overflow: hidden;
`;

const Container = styled.div`
  margin-bottom: 32px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 1.3em;
`;

const HorizontalSeparator = styled.hr`
  flex-grow: 1;
  align-self: center;

  margin: 16px;
  border-top: 1px solid black;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  width: 50px;

  transform: ${props => (props.isOpen ? 'rotate(180deg)' : 'none')};
`;

const ComponentsGrid = styled.div`
  display: ${props => (props.isOpen ? 'grid' : 'none')};
  grid-template-columns: 1fr 1fr;
  grid-gap: 8px;
`;

const ComponentButton = styled.button`
  display: flex;
  width: 170px;
  align-items: center;
  padding: 8px;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid gray;
  border-radius: 5px;

  :hover {
    background: rgba(0, 0, 0, 0.1);
    border-style: dashed;
  }
`;

const ComponentTitle = styled.h2`
  font-weight: normal;
  font-size: 1.2em;
`;

const ComponentIcon = styled.div`
  margin-right: 16px;
  display: contents;
`;

const getInitialValues = component =>
  Object.fromEntries(
    component.configurations.map(configuration => [
      configuration.name,
      configuration.default,
    ]),
  );

const ComponentGroup = ({
  name,
  components,
  isOpen,
  close,
}) => {
  const [groupOpen, setGroupOpen] = useState(true);

  return (
    <Container>
      <Header onClick={() => setGroupOpen(!groupOpen)}>
        <Title>{name}</Title>
        <HorizontalSeparator />
        <IconButton isOpen={groupOpen} onClick={() => setGroupOpen(!groupOpen)}>
          <Chevron />
        </IconButton>
      </Header>
      <ComponentsGrid isOpen={groupOpen}>
        {components.map(component => (
          <DragArea error={false}>
            <DraggableComponent
                  teste={component}
                  component={component}
                  configurations={getInitialValues(component)}
                  isOpen={isOpen}
                  close={close}
            />
          </DragArea>
        ))}
      </ComponentsGrid>
    </Container>
  );
};

export default ComponentGroup;
