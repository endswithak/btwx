import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import FontFamilySelector from './FontFamilySelector';

const FontFamilySelectorWrap = (): ReactElement => {
  const isOpen = useSelector((state: RootState) => state.fontFamilySelector.isOpen);
  return (
    isOpen
    ? <FontFamilySelector />
    : null
  );
}

export default FontFamilySelectorWrap;