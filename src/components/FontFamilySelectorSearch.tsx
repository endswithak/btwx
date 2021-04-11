/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { forwardRef } from 'react';
import SearchFormControl from './SearchFormControl';
import Form from './Form';

interface FontFamilySearchProps {
  search: string;
  searching: boolean;
  setSearch(search: string): void;
  setSearching(searching: boolean): void;
}

const FontFamilySearch = forwardRef(function FontFamilySearch(props: FontFamilySearchProps, ref) {
  const { search, searching, setSearch, setSearching } = props;

  const handleChangeDebounce = (value: any): void => {
    setSearch(value)
  }

  const handleBlur = (e: any): void => {
    setSearching(false);
  }

  const handleFocus = (e: any): void => {
    setSearching(true);
  }

  const handleClear = (): void => {
    setSearch('');
    setSearching(false);
  }

  return (
    <Form
      inline
      canvasAutoFocus>
      <SearchFormControl
        ref={ref}
        value={search}
        isActive={searching}
        placeholder='Search Typefaces...'
        onBlur={handleBlur}
        onFocus={handleFocus}
        onClear={handleClear}
        onChangeDebounce={handleChangeDebounce} />
    </Form>
  )
});

export default FontFamilySearch;