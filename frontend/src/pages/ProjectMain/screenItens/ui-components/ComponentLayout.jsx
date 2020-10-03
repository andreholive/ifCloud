import styled from 'styled-components';

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 15px;
  align-content: space-between;
`;

export const Content = styled.div`
  padding-top: 15px;
  width: 350px;
  margin: 0 auto;
`;

export const IconButton = styled.button`
  flex-shrink: 0;

  border: 1px solid gray;
  border-radius: 25px;
  width: 50px;
  height: 50px;

  background: none;
  margin-right: ${props => (props.first ? '12px' : '0')};
  margin-left: 12px;

  :hover {
    background: rgba(0, 0, 0, 0.05);
    cursor: pointer;
  }
`;
