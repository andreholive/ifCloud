import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import LogInApi from '../../services/authApi';
import './styles.css';
import CloudsImg from '../../assets/clouds.png';
import logoImg from '../../assets/logo_ifcloud.png';
import {changeProject} from '../../data/users'

export default function Logon(){
    const [id, setId] = useState('');
    const [pass, setPass] = useState('');
    const history = useHistory();
    
    useEffect(() => {
        localStorage.clear()
      },[]);
    

    async function handleLogin(e){
        e.preventDefault();
        
            const data = {
                id : id,
                pass: pass
            };
            try{
            const response = await LogInApi(data);
            localStorage.setItem('userId', response.user_id);
            console.log(response)
            if(response.projects.length>1){
                history.push(`/projects`)
            }
            else{
                const project = await changeProject(response.projects[0].id)
                if(project){
                localStorage.setItem('projectID', project)
                history.push(`/project/${project}`)
                }
            }
            }catch(err){

            
            }
        }
    
    return (
        <div className="logon-container">
            <section className="form">
                <img src={logoImg} alt="ifCloud" width="350px"/>

                <form onSubmit={handleLogin}>
                    <h1>Faça seu logon</h1>

                    <input 
                        placeholder="Nome de Usuário" 
                        value={id}
                        onChange={e => setId(e.target.value)}
                    />
                    <input 
                        placeholder="Sua Senha" 
                        type="password"
                        value={pass}
                        onChange={e => setPass(e.target.value)}
                    />
                    <button type="submit" className="button">Entrar</button>

                    
                </form>
            </section>
            <img src={CloudsImg} alt="Clouds"  width="700px"/>
        </div>
    );
}