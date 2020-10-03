import React, {useState} from 'react';
import Modal from  '../Modal'
import ModalTitle from '../ModalTitle';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  padding: 16px;
`;

const Button = styled.button`
    width: 150px;
    height: 40px;
    background: #5b81c7;
    border: 0;
    border-radius: 8px;
    color: #fff;
    font-weight: 700;
    display: inline-block;
    text-align: center;
    text-decoration: none;
    font-size: 18px;
    transition: filter 0.2s;
    align-items: flex-end;
    margin-top: 10px;
    &:hover{
        filter: brightness(80%);
    }
`;

function NewUser({createUser, setUserOpen}){
    const initialValues = {
        username: '',
        email: '',
    }
    const [values, setValues] = useState(initialValues);

    function setValue(key, value){
        setValues({
            ...values,
            [key]: value
        })
    }

    function createNewUser(userData){
        if(!userData.username || !userData.email)
        {
            return
        }
        setValues(initialValues);
        createUser(userData);
    }

    return(
        <Modal>
            <ModalTitle close={setUserOpen}>Novo Usuário</ModalTitle>
            <Container>
            <form onSubmit={function handleSubmit(event){
                event.preventDefault();
                createNewUser(values);
            }}>
            <div>
            <label>
                Nome do Usuário: 
            <input type='text' 
            value={values.username}
            onChange={e => setValue('username', e.target.value)}
            />
            </label>
            </div>
            <div>
            <label>
                Email: 
            <input type='text' 
            value={values.email}
            onChange={e => setValue('email', e.target.value)}
            />
            </label>
            </div>
            <Button>Cadastrar</Button>
            </form>
            </Container>
        </Modal>
    )
}

export default NewUser;