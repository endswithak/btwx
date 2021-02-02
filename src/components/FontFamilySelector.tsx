import React, { ReactElement, useEffect, useState, useContext, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { closeFontFamilySelector } from '../store/actions/fontFamilySelector';
import FontFamilySelectorSearch from './FontFamilySelectorSearch';
import FontFamilySelectorItems from './FontFamilySelectorItems';
import { ThemeContext } from './ThemeProvider';


const FontFamilySelector = (): ReactElement => {
  const searchTextFieldRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const systemFonts = useSelector((state: RootState) => state.textSettings.systemFonts);
  const y = useSelector((state: RootState) => state.fontFamilySelector.y);
  const [itemData, setItemData] = useState([]);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const dispatch = useDispatch();

  const onMouseDown = (event: any): void => {
    if (!listRef.current.contains(event.target) && !searchTextFieldRef.current.contains(event.target)) {
      dispatch(closeFontFamilySelector());
    }
  }

  const getItemData = (search?: string): { value: string; label: boolean }[] => {
    if (search.replace(/\s/g, '').length > 0) {
      return systemFonts.reduce((result, current) => {
        if (current.toUpperCase().includes(search.replace(/\s/g, '').toUpperCase())) {
          result = [...result, { value: current, label: current }];
        }
        return result;
      }, []);
    } else {
      return systemFonts.reduce((result, current) => {
        return [...result, { value: current, label: current }];
      }, []);
    }
  }

  useEffect(() => {
    if (searchTextFieldRef.current) {
      searchTextFieldRef.current.focus();
      searchTextFieldRef.current.select();
    }
    document.addEventListener('mousedown', onMouseDown);
    return (): void => {
      document.removeEventListener('mousedown', onMouseDown);
    }
  }, []);

  useEffect(() => {
    setItemData(getItemData(search));
  }, [search]);

  return (
    <div
      className='c-font-family-selector'
      ref={listRef}
      style={{
        top: y,
        background: tinyColor(theme.name === 'dark'
        ? theme.background.z1
        : theme.background.z2).setAlpha(0.77).toRgbString(),
        boxShadow: `0 0 0 1px ${theme.name === 'dark'
        ? theme.background.z4
        : theme.background.z5
        }, 0 4px 16px 0 rgba(0,0,0,0.16)`
      }}>
      <FontFamilySelectorSearch
        ref={searchTextFieldRef}
        search={search}
        setSearch={setSearch}
        searching={searching}
        setSearching={setSearching} />
      <FontFamilySelectorItems
        itemData={itemData}
        search={search}
        searching={searching} />
    </div>
  );
}

export default FontFamilySelector;