import React, {useEffect, useState} from 'react';
import Header from '../components/Header';
import {getUserProjects, changeProject} from '../../data/users';
import Modal from  '../components/Modal'
import ModalTitle from '../components/ModalTitle';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

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


function Projects(){
    const history = useHistory();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(0);
    
    useEffect(() => {
        async function handleProjects(){
        const response = await getUserProjects(localStorage.getItem("userId"));
        setProjects(response);
        }
        handleProjects();
      },[]);
    
    async function handleChangeProject(){
        if(selectedProject)
        {
        const project = await changeProject(selectedProject);
        if(project){
            history.push(`/project/${project}`);
        }
        }
    }

    return (
        <>
        <Header/>
        <Modal>
            <ModalTitle>Selecionar Projeto</ModalTitle>
            <div className="selectdiv">
        <select 
            name="projects" 
            id="projects"
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}>
                <option value={0}>Selecione um Projeto</option>
                {projects.map(project => <option 
                key={project.id}
                value={project.id}
                >{project.name}</option>)}
        </select>
        <Button onClick={()=>{handleChangeProject()}}>Ir para o Projeto</Button>
        </div>
        
        </Modal>
        <div className='main_container'>
        
        </div>

        </>
    )
}

export default Projects;