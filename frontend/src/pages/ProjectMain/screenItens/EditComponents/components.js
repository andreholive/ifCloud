import styled from 'styled-components';

export const Label = styled.label`
padding: 2px;
position: relative;
background: #8fa1ce;
color: #fff;
margin-left: 13px;
top: 10px;
border-radius: 6px;
padding-inline-start: 7px;
padding-inline-end: 7px;
width: max-content;
justify-content: center;
`;

export const Content = styled.div`
display: flex;
width: 80%;
margin: 0 auto;
height: 100%;
flex-direction: column;
`;

export const Input= styled.input`
width: 100%;
height: 60px;
color: #333;
border: 1px solid #dcdce6;
border-radius: 8px;
padding: 0 24px;
margin-bottom: 10px;
::placeholder {
  font-weight: 300;
  color: #cfcfcf;
}
`;

export const PortsContent = styled.div`
width: 100%;
height: 200px;
border-radius: 8px;
padding: 14px 8px 5px;
margin-top: 0px;
border: 1px solid #dcdce6;
overflow-y: auto;
`;

export const IconButton = styled.button`
flex-shrink: 0;

border: 1px solid gray;
border-radius: 25px;
width: 50px;
height: 50px;

background: none;
margin-left: 12px;

:hover {
  background: rgba(0, 0, 0, 0.05);
  cursor: pointer;
}
`;