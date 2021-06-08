/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setSearch, setSearching } from '../store/actions/leftSidebar';
import SearchFormControl from './SearchFormControl';
import Form from './Form';

const SidebarLayersSearch = (): ReactElement => {
  const inputRef = useRef(null);
  const searching = useSelector((state: RootState) => state.leftSidebar.searching);
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
    <Form
      inline
      canvasAutoFocus>
      <SearchFormControl
        id='control-layers-search'
        ref={inputRef}
        value={search}
        isActive={searching}
        placeholder='Search Layers...'
        onBlur={handleBlur}
        onFocus={handleFocus}
        onClear={handleClear}
        onChangeDebounce={handleChangeDebounce} />
    </Form>
  )
}

export default SidebarLayersSearch;