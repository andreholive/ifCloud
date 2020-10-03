import React from 'react';
import styled from 'styled-components';
import {changeProject} from '../../../data/users'
import { useHistory } from 'react-router-dom';

const Project = styled.div`
width: 100%;
color: white;
overflow: hidden;
`;

const Radio = styled.input`
    position: absolute;
    opacity: 0;
    z-index: -1;
`;

const ProjectLabel = styled.label`
    display: flex;
    justify-content: space-between;
    padding: 1em;
    background: #737fc7;
    font-weight: bold;
    cursor: pointer;
    &:hover {
        background: #8d97d6;
    }
    &::after {
        content: "⏵";
    }
    
`;

const Content = styled.div`
    max-height: 0;
    padding: 0 5px;
    color: #666;
    background: white;
    display: grid;
    grid-column-gap: 5px;
    grid-template-columns: auto auto;
    transition: all .35s;
`;




function ProjectItem({children, id, handleDeletetProject }){
    const history = useHistory();

    async function goToProject(){
        const project = await changeProject(id)
        if(project){
        history.push(`/project/${project}`);
        }
    }


    return(
        <Project key={id}>
        <ProjectLabel htmlFor={id}>
            {children}
        </ProjectLabel>
        <Radio type='checkbox' id={id} className='radio_project'/>
        <Content className='content_project'>
            <button onClick={()=>{goToProject()}}>Ir para o projeto</button>
            <button onClick={()=>{handleDeletetProject(id)}}>Excluir</button>
        </Content>
        </Project>
    )
}

export default ProjectItem;