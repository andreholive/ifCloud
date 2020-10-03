import React, { useEffect, useRef } from 'react';
import Tooltip from 'react-tooltip';

import { Formik, Form, Field } from 'formik';
import styled from 'styled-components';

import { ArrowLeft } from '../Icons';
import ComponentConfigurationInput from './ComponentConfigurationInput';
import { Header, Content, IconButton } from './ComponentLayout';
import DraggableComponent from './DraggableComponent';

const DragArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 235px;
  height: 130px;
  margin: 0 auto;

  box-shadow: ${props =>
    `inset 0 0 20px rgba(${props.error ? 255 : 0}, 0, 0, 0.3)`};

  background-image: ${props => `linear-gradient(
      to right,
      rgba(${props.error ? 255 : 0}, 0, 0, 0.1) 1px,
      transparent 1px,
      transparent 15px,
      rgba(${props.error ? 255 : 0}, 0, 0, 0.05) 15px,
      transparent 16px,
      transparent 30px,
      rgba(${props.error ? 255 : 0}, 0, 0, 0.05) 30px,
      transparent 31px
    ),
    linear-gradient(
      to bottom,
      rgba(${props.error ? 255 : 0}, 0, 0, 0.1) 1px,
      transparent 1px,
      transparent 15px,
      rgba(${props.error ? 255 : 0}, 0, 0, 0.05) 15px,
      transparent 16px,
      transparent 30px,
      rgba(${props.error ? 255 : 0}, 0, 0, 0.05) 30px,
      transparent 31px
    )`};
  background-size: 45px 45px;
  border-radius: 25px;

  overflow: hidden;
`;

const Title = styled.h1`
  flex-grow: 1;
  font-size: 1.5em;

  margin: 0;

  align-self: center;
  text-align: center;
`;

const FormScroll = styled.div`
height: 375px;
overflow-y: auto;
width: 335px;
margin: 0 auto;
`;

const Footer = styled.div`
  display: flex;
`;

const SubmitButton = styled.button.attrs(({ ...props }) => ({
  ...props,
  type: 'submit',
}))`
  border: none;
  border-radius: 5px;
  background: #737fc7;

  color: white;
  font-size: 1.2em;

  width: 200px;
  padding: 5px 20px;
  margin: 5px;

  :disabled {
    background: #d22307;
    cursor: not-allowed;
  }
`;

const getInitialValues = component =>
  Object.fromEntries(
    component.configurations.map(configuration => [
      configuration.name,
      configuration.default,
    ]),
  );

const getFormSubmitLabel = (isValid, editMode) => {
  if (!isValid) return 'Verique os Erros';
  if (editMode) return 'Edit component';
  return 'Criar Host';
};

const ComponentConfiguration = ({
  editMode,
  component,
  handleClose,
  handleBack,
  handleSubmit,
}) => {
  const firstInputRef = useRef();
  const buttonRef = useRef();

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    } else {
      buttonRef.current.focus();
    }
  });

  useEffect(Tooltip.rebuild);

  return (
    <>
      <Header>
        {!editMode && (
          <IconButton
            first
            onClick={handleBack}
            data-for="tooltip"
            data-tip="Voltar"
            data-place="right"
          >
            <ArrowLeft />
          </IconButton>
        )}
        <Title>Configurar Roteador</Title>
        
      </Header>

      <Content>
        <Formik
          initialValues={getInitialValues(component)}
          
          onSubmit={values => {
            handleSubmit(null, {
              type: component.type,
              configurations: values,
            });
            handleClose();
          }}
        >
          {({ values, isValid }) => (
            <Form>
              <DragArea error={!isValid}>
                <DraggableComponent
                  component={component}
                  configurations={values}
                  handleClose={handleClose}
                  error={!isValid}
                  disabled={editMode}
                />
              </DragArea>
              <FormScroll autoComplete="off">
                  {component.configurations.map(
                  (configuration, index) => (
                    <Field
                      key={configuration.name}
                      component={ComponentConfigurationInput}
                      innerRef={index === 0 ? firstInputRef : null}
                      {...configuration}
                      validate={
                        configuration.validate
                          ? value =>
                              configuration.validate(value, values)
                          : null
                      }
                      
                    />
                    
                  ),
                )}
                
                </FormScroll>
              <button onClick={()=>{}}>PRESS</button>
              <Footer>
                <SubmitButton disabled={!isValid} ref={buttonRef}>
                  {getFormSubmitLabel(isValid, editMode)}
                </SubmitButton>
              </Footer>
            </Form>
          )}
        </Formik>
        
      </Content>
    </>
  );
};

export default ComponentConfiguration;
