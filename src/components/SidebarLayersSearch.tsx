/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setSearch, setSearching } from '../store/actions/leftSidebar';
import SearchInput from './SearchInput';

const SidebarLayersSearch = (): ReactElement => {
  const inputRef = useRef(null);
  const active = useSelector((state: RootState) => state.leftSidebar.searching);
  const search = useSelector((state: RootState) => state.leftSidebar.search);
  const dispatch = useDispatch();

  const handleChangeDebounce = (value: any): void => {
    dispatch(setSearch({search: value}));
  }

  const handleBlur = (e: any): void => {
    dispatch(setSearching({searching: false}));
  }

  const handleFocus = (e: any): void => {
    dispatch(setSearching({searching: true}));
  }

  const handleClear = (): void => {
    dispatch(setSearching({searching: false}));
  }

  return (
    <SearchInput
      ref={inputRef}
      value={search}
      active={active}
      field={{
        id: 'layers-search-input',
        placeholder: 'Search Layers...',
        onFocus: (e): void => handleFocus(e),
        onBlur: (e): void => handleBlur(e)
      }}
      onClear={handleClear}
      onChangeDebounce={handleChangeDebounce}
      submitOnBlur />
  )
}

export default SidebarLayersSearch;