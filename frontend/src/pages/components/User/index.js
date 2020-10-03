import React from 'react';
import styled from 'styled-components';

const UserItem = styled.div`
  width: 100%;
  height: 30px;
  margin: 5px;
`;

function User({name, id, setSelectedUser}){
    return(
        <UserItem onClick={()=>{setSelectedUser(id)}}>
            {name}
        </UserItem>
    )
}

export default User;