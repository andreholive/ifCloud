import React, { useState, useEffect } from 'react';
import Tooltip from 'react-tooltip';

import styled from 'styled-components';

import ComponentGroup from './ComponentGroup';

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 15px;
  margin: 0 auto;
  width: 410px;
  align-content: space-between;
`;

const SearchBar = styled.input`
  width: 100%;
  height: 60px;
  color: #333;
  border: 1px solid #dcdce6;
  border-radius: 8px;
  padding: 0 24px;
  margin-top: 10px;
  ::placeholder {
    font-weight: 300;
    color: #cfcfcf;
  }
`;
const Content = styled.div`
  padding-top: 15px;
  width: 410px;
  margin: 0 auto;
`;

const ComponentSearch = ({
  groups,
  isOpen,
  close,
}) => {

  useEffect(Tooltip.rebuild);

  const [filteredGroups, setFilteredGroups] = useState(groups);
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = value => {
    setSearchText(value);

    if (!value) {
      setFilteredGroups(groups);
      return;
    }

    const like = new RegExp(`${value}.*`, 'i');

    const newFilteredGroups = groups
      .map(group => {
        const hasAnyMatchingComponent = group.components.some(
          component => component.name.match(like),
        );

        if (hasAnyMatchingComponent)
          return {
            ...group,
            components: group.components.filter(component =>
              component.name.match(like),
            ),
          };
        return null;
      })
      .filter(group => group != null);

    setFilteredGroups(newFilteredGroups);
  };

  const handleKeyDown = key => {
    if (key === 'Escape') {
      setSearchText('');
      setFilteredGroups(groups);
    }

    if (
      key === 'Enter' &&
      searchText &&
      filteredGroups.length > 0 &&
      filteredGroups[0].components.length > 0
    ) {
      
    }
  };

  return (
    <div style={!isOpen ? {display: 'none'} : {display: 'block'}}>
      <Header>
        <SearchBar
          autoFocus
          placeholder="Procurar Dispositivos"
          value={searchText}
          onChange={({ target: { value } }) =>
            handleSearchChange(value)
          }
          onKeyDown={({ key }) => handleKeyDown(key)}
        />
        
      </Header>

      <Content>
        {filteredGroups.map(({ name, components }) => (
          <ComponentGroup
            name={name}
            components={components}
            key={name}
            isOpen={isOpen}
            close={close}
          />
        ))}
      </Content>
    </div>
  );
};

export default ComponentSearch;
