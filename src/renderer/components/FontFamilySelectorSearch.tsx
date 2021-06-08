/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { forwardRef } from 'react';
import SearchFormControl from './SearchFormControl';
import Form from './Form';

interface FontFamilySearchProps {
  search: string;
  searching: boolean;
  itemData: { value: string; label: string }[];
  setSearch(search: string): void;
  setSearching(searching: boolean): void;
}

const FontFamilySearch = forwardRef(function FontFamilySearch(props: FontFamilySearchProps, ref) {
  const { search, searching, itemData, setSearch, setSearching } = props;

  const handleChangeDebounce = (value: any): void => {
    setSearch(value)
  }

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      const items = document.getElementById('control-font-family-selector') as HTMLSelectElement;
      if (itemData.length > 0) {
        items.focus();
      }
    }
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
        onKeyDown={handleKeyDown}
        onChangeDebounce={handleChangeDebounce} />
    </Form>
  )
});

export default FontFamilySearch;