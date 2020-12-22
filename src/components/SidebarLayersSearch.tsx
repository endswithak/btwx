/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useContext, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash.debounce';
import { RootState } from '../store/reducers';
import { setSearch, setSearching } from '../store/actions/leftSidebar';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';
import Icon from './Icon';
import IconButton from './IconButton';

const SidebarLayersSearch = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const searchActive = useSelector((state: RootState) => state.leftSidebar.searching);
  const search = useSelector((state: RootState) => state.leftSidebar.search);
  // const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState(search);
  const [hover, setHover] = useState(false);
  const dispatch = useDispatch();

  const debounceSearch = useCallback(
    debounce((value: string) => {
      dispatch(setSearch({search: value}));
    }, 100),
    []
  );

  const handleSearchChange = (e: any) => {
    const target = e.target;
    setInputValue(target.value);
    debounceSearch(target.value);
  };

  const handleSearchSubmit = (e: any) => {
    return;
  }

  const handleSearchBlur = () => {
    if (inputValue.replace(/\s/g, '').length === 0) {
      setInputValue('');
      debounceSearch('');
      dispatch(setSearching({searching: false}));
    }
    // setFocused(false);
  }

  const handleSearchFocus = () => {
    if (!searchActive) {
      dispatch(setSearching({searching: true}));
    }
    // setFocused(true);
  }

  const handleClearSearch = () => {
    setInputValue('');
    debounceSearch('');
    dispatch(setSearching({searching: false}));
  }

  return (
    <div
      className='c-sidebar__search'
      onMouseEnter={(): void => setHover(true)}
      onMouseLeave={(): void => setHover(false)}
      style={{
        boxShadow: `0 1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5}`
      }}>
      <div className='c-sidebar-search__icon'>
        <Icon
          name='search'
          small
          style={{
            fill: searchActive
            ? theme.palette.primary
            : hover
              ? theme.text.base
              : theme.text.lighter
          }} />
      </div>
      <div
        className='c-sidebar-search__input'>
        <SidebarInput
          id='layers-search-input'
          value={inputValue}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
          submitOnBlur
          isSearch
          placeholder='Search' />
      </div>
      {
        inputValue.length > 0
        ? <div className='c-sidebar-search__clear'>
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

export default SidebarLayersSearch;