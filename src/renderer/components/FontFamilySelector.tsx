import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { closeFontFamilySelector } from '../store/actions/fontFamilySelector';
import FontFamilySelectorSearch from './FontFamilySelectorSearch';
import FontFamilySelectorItems from './FontFamilySelectorItems';


const FontFamilySelector = (): ReactElement => {
  const searchTextFieldRef = useRef(null);
  const listRef = useRef<HTMLDivElement>(null);
  const systemFonts = useSelector((state: RootState) => state.textSettings.systemFonts);
  const y = useSelector((state: RootState) => state.fontFamilySelector.y);
  const [itemData, setItemData] = useState(null);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onMouseDown = (event: any): void => {
    if (!listRef.current.contains(event.target)) {
      dispatch(closeFontFamilySelector());
    }
  }

  const getItemData = (search?: string): { value: string; label: boolean }[] => {
    if (search.replace(/\s/g, '').length > 0) {
      return systemFonts.reduce((result, current) => {
        if (current.replace(/\s/g, '').toUpperCase().includes(search.replace(/\s/g, '').toUpperCase())) {
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
    document.addEventListener('mousedown', onMouseDown, true);
    setLoading(true);
    return (): void => {
      document.removeEventListener('mousedown', onMouseDown, true);
    }
  }, []);

  useEffect(() => {
    if (loading) {
      setItemData(getItemData(search));
    }
  }, [loading]);

  useEffect(() => {
    if (itemData && loading) {
      setLoading(false);
    }
  }, [itemData]);

  useEffect(() => {
    if (itemData) {
      setItemData(getItemData(search));
    }
  }, [search]);

  return (
    <div
      className='c-font-family-selector'
      ref={listRef}
      style={{
        top: y
      }}>
      <FontFamilySelectorSearch
        ref={searchTextFieldRef}
        search={search}
        setSearch={setSearch}
        searching={searching}
        setSearching={setSearching}
        itemData={itemData} />
      <FontFamilySelectorItems
        itemData={itemData}
        search={search}
        searching={searching}
        loading={loading} />
    </div>
  );
}

export default FontFamilySelector;