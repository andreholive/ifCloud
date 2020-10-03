import React, {useState} from 'react';
import Modal from  '../Modal'

function NewUser({projects, setUserProjectsOpen}){
    
    return(
        <Modal>
            <button onClick={()=>{setUserProjectsOpen(false)}}>Fechar</button>
            {projects.length==0 && <div>Carregando Projetos...</div>}
            {projects.map(project => {
                return (
                    <div>
                        {project.name}
                    </div>
                )
            })}
        </Modal>
    )
}

export default NewUser;