import React, {useEffect, useState} from 'react';
import Header from '../components/Header';
import User from '../components/User';
import getUsers, {createUser} from '../../data/users';
import NewUser from '../components/NewUser';
import UserConfig from '../components/UserConfig';
import './admin.scss';

function AdminPage(){

    const [users, setUsers] = useState([])
    const [userOpen, setUserOpen] = useState(false);
    const [user, setUser] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    

    useEffect(() => {
        setUsers([]);
        async function user(){
        const users = await getUsers();
        setUsers(users);
        }
        user();
      },[user]);
    
    async function createNewUser(userData){
        const responseUser = await createUser(userData);
        setUserOpen(false);
        setUser(responseUser);
    }   

    return (
        <>
        <Header/>
        <div className='main_container'>
            <div className='user_list'>
            {users.length==0 && <div>Carregando Usuários...</div>}
            {users.map(user => (
                <User 
                key={user.id}
                name={user.name}
                id={user.id}
                setSelectedUser={setSelectedUser}
                />
            ))}
            </div>
            <div className='user_functions'>
                <button className='button_new_user' onClick={()=>setUserOpen(true)}>Novo Usuário</button>
            </div>
        </div>

        {userOpen && <NewUser 
        createUser={createNewUser}
        setUserOpen={setUserOpen}
        />}

        {selectedUser && <UserConfig
        users={users}
        setSelectedUser={setSelectedUser}
        selectedUser={selectedUser}
        />}

        </>
    )
}

export default AdminPage;