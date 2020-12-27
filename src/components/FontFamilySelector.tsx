import React, { ReactElement, useEffect, useState, useContext, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import tinyColor from 'tinycolor2';
import { RootState } from '../store/reducers';
import { getSelectedFontFamily } from '../store/selectors/layer';
import { closeFontFamilySelector } from '../store/actions/fontFamilySelector';
import FontFamilySelectorSearch from './FontFamilySelectorSearch';
import FontFamilySelectorItems from './FontFamilySelectorItems';
import { ThemeContext } from './ThemeProvider';

const FontFamilySelector = (): ReactElement => {
  const listRef = useRef<HTMLDivElement>(null);
  const theme = useContext(ThemeContext);
  const fontFamily = useSelector((state: RootState) => getSelectedFontFamily(state));
  const systemFonts = useSelector((state: RootState) => state.textSettings.systemFonts);
  const y = useSelector((state: RootState) => state.fontFamilySelector.y);
  const [itemData, setItemData] = useState([]);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const dispatch = useDispatch();

  const onMouseDown = (event: any): void => {
    if (listRef.current && !listRef.current.contains(event.target) && !document.getElementById('font-family-input').contains(event.target)) {
      dispatch(closeFontFamilySelector());
    }
  }

  const getItemData = (family: string, search?: string): { family: string; selected: boolean }[] => {
    if (search.replace(/\s/g, '').length > 0) {
      return systemFonts.reduce((result, current) => {
        if (current.toUpperCase().includes(search.replace(/\s/g, '').toUpperCase())) {
          result = [...result, { family: current, selected: family && family !== 'multi' && current === family }];
        }
        return result;
      }, []);
    } else {
      return systemFonts.reduce((result, current) => {
        return [...result, { family: current, selected: family && family !== 'multi'  && current === family }];
      }, []);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown);
    return (): void => {
      document.removeEventListener('mousedown', onMouseDown);
    }
  }, []);

  useEffect(() => {
    setItemData(getItemData(fontFamily, search));
  }, [fontFamily, search]);

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
        search={search}
        setSearch={setSearch}
        searching={searching}
        setSearching={setSearching} />
      <FontFamilySelectorItems
        itemData={itemData} />
    </div>
  );
}

export default FontFamilySelector;