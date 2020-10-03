import React from 'react';
import { faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 60px;
  padding: 16px;
  background: #5b81c7;
`;

const Title = styled.div`
  position: relative;
  float: left;
  width: 95%;
  height: 24px;
  font-size: 20px;
  color: #fff;
  font-weight: 700;
  text-align: center;
`;

const BtnClose = styled.div`
position: relative;
float: left;
width: 5%;
height: 24px;
font-size: 24px;
color: #fff;
cursor: pointer;
transition: filter 0.2s;
&:hover{
    filter: brightness(80%);
}
`;


function ModalTitle({children, close}){
    return(
        <Container>
        <Title>
            {children} 
        </Title>
        <BtnClose>
        <FontAwesomeIcon icon={faTimesCircle} onClick={()=>{close(null)}}/>
        </BtnClose>
        </Container>
    )
}

export default ModalTitle;