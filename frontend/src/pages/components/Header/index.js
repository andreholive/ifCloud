import React from 'react'
import Logo from '../../../assets/logo_ifcloud.png'
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 2;
  width: 150px;
`;

const HeaderContainer = styled.header`
  width: 100%;
  height: 100px;
`;

function Header(){
    return(
        <HeaderContainer>
            <Container>
                <img src={Logo} alt='logo' className='logo'/>
            </Container>
        </HeaderContainer>
    )
}

export default Header;