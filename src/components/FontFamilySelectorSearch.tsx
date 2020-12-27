/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useContext, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';
import Icon from './Icon';
import IconButton from './IconButton';

interface FontFamilySearchProps {
  search: string;
  searching: boolean;
  setSearch(search: string): void;
  setSearching(searching: boolean): void;
}

const FontFamilySearch = (props: FontFamilySearchProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { search, searching, setSearch, setSearching } = props;
  const [inputValue, setInputValue] = useState(search);
  const [hover, setHover] = useState(false);

  const debounceSearch = useCallback(
    debounce((value: string) => setSearch(value), 100),
    []
  );

  const handleSearchChange = (e: any): void => {
    const target = e.target;
    setInputValue(target.value);
    debounceSearch(target.value);
  };

  const handleSearchSubmit = (e: any): void => {
    return;
  }

  const handleSearchBlur = (): void => {
    if (inputValue.replace(/\s/g, '').length === 0) {
      setInputValue('');
      debounceSearch('');
      setSearching(false);
    }
  }

  const handleSearchFocus = (): void => {
    if (!searching) {
      setSearching(true);
    }
  }

  const handleClearSearch = (): void => {
    setInputValue('');
    debounceSearch('');
    setSearching(false);
  }

  return (
    <div
      className='c-font-family-selector__search'
      onMouseEnter={(): void => setHover(true)}
      onMouseLeave={(): void => setHover(false)}
      style={{
        boxShadow: `0 1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
      }}>
      <div className='c-font-family-selector__icon'>
        <Icon
          name='search'
          small
          style={{
            fill: searching
            ? theme.palette.primary
            : hover
              ? theme.text.base
              : theme.text.lighter
          }} />
      </div>
      <div
        className='c-font-family-selector__input'>
        <SidebarInput
          id='font-family-selector-search-input'
          value={inputValue}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
          submitOnBlur
          isSearch
          placeholder='Search Typefaces' />
      </div>
      {
        inputValue.length > 0
        ? <div className='c-font-family-selector__clear'>
            <IconButton
              icon='close-small'
              variant='small'
              onClick={handleClearSearch} />
          </div>
        : null
      }
    </div>
  )
}

export default FontFamilySearch;