import React, {useState, useEffect} from 'react';
import Modal from  '../Modal';
import { 
    getUserProjects, 
    updateUser, 
    getRoles, 
    createUserProject,
    deletetProject
} from '../../../data/users';
import ModalTitle from '../ModalTitle';
import ProjectItem from '../ProjectItem';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  max-height: 442px;
  padding: 16px;
  display: flex;
  flex-direction: row;
`;
const Row1 = styled.div`
  width: 50%;
  padding: 2px;
  overflow-y:auto;
`;
const Row2 = styled.div`
  width: 50%;
  padding: 2px;
  margin-right: 5px;
`;

const NewProject = styled.div`
  width: 100%;
  margin-top: 15px;
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

const Projects = styled.div`
border-radius: 8px;
overflow: hidden;
box-shadow: 0 4px 4px -2px rgba(0,0,0,0.5);
`;

function UserConfig({setSelectedUser, selectedUser, users}){
    const [projects, setProjects] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(0);
    const [projectName, setProjectName] = useState('');
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

    useEffect(() => {
        function returnUser(user) { 
            return user.id === selectedUser;
        }
        const user = users.find(returnUser);
        let email = '';
        user.email ? email=user.email : email = '';
        setValues({'username': user.name, 'email':email});
        async function getProjects(){
        const responseProjects = await getUserProjects(selectedUser);
        setProjects(responseProjects)
        }
        async function getAllRoles(){
            const responseRoles = await getRoles();
            setRoles(responseRoles)
            }
        getProjects();
        getAllRoles();
      },[selectedUser, !values]);

    async function createProject(){
        const project = await createUserProject(projectName, selectedUser, selectedRole);
        if(project){
            setProjects([...projects, project]);
            setProjectName('');
            setSelectedRole(0);
        }
    }

    async function handleDeletetProject(project_id){
        const deleteProject = await deletetProject(project_id);
        if(deleteProject){
            function returnProject(project) { 
                return project.id === deleteProject;
            }
            const project = projects.find(returnProject);
            let projectsArray = projects;
            var index = projectsArray.indexOf(project);
            projectsArray.splice(index, 1)
            setProjects([...projectsArray]);
        }
    }

    return(
        <Modal>
            <ModalTitle close={setSelectedUser}>{values.username}</ModalTitle>
            <Container>
            <Row2>
            <form onSubmit={function handleSubmit(event){
                event.preventDefault();
                updateUser(values, selectedUser);
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
            <Button>Salvar</Button>
            </form>
            </Row2>
            <Row1 className='scroll1'>
            <h2>Projetos</h2>
            {projects.length==0 && <div>Carregando Projetos...</div>}
            <Projects>
            {projects.map(project => {
                return (
                    <ProjectItem 
                    key={project.id}
                    id={project.id}
                    handleDeletetProject={handleDeletetProject}
                    >
                        {project.name}
                    </ProjectItem>
                )
            })}
            </Projects>
            <NewProject>
            <h2>Criar Projeto</h2>
            <form onSubmit={function handleSubmit(event){
                event.preventDefault();
            }}>
            <label>
                Nome do Projeto: 
            <input 
                type='text' 
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                />
            </label>
            <label>
                Função: 
            <select 
            name="roles" 
            id="roles"
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}>
                <option value={0}>Selecione uma Função</option>
                {roles.map(role => <option 
                key={role.id}
                value={role.id}
                >{role.name}</option>)}
            </select>
            </label>
            <Button onClick={() => {createProject()}}>Criar</Button>
            </form>  
            </NewProject>
            </Row1>
            </Container>
        </Modal>
    )
}

export default UserConfig;