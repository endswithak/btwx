/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { forwardRef } from 'react';
import SearchInput from './SearchInput';

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
    setSearching(false);
  }

  return (
    <SearchInput
      ref={ref}
      value={search}
      active={searching}
      field={{
        placeholder: 'Search Typefaces...',
        onFocus: (e): void => handleFocus(e),
        onBlur: (e): void => handleBlur(e)
      }}
      onClear={handleClear}
      onChangeDebounce={handleChangeDebounce}
      submitOnBlur />
  )
});

export default FontFamilySearch;