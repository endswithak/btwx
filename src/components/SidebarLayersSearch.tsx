/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useContext, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';
import SidebarInput from './SidebarInput';
import Icon from './Icon';
import IconButton from './IconButton';
import debounce from 'lodash.debounce';

gsap.registerPlugin(ScrollToPlugin);

interface SidebarLayersSearchProps {
  searchActive: boolean;
  search: string;
  setSearchActive(searchActive: boolean): void;
  setSearch(search: string): void;
  selected?: string[];
}

const SidebarLayersSearch = (props: SidebarLayersSearchProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { searchActive, search, setSearchActive, setSearch, selected } = props;
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState(search);

  useEffect(() => {
    if (selected.length > 0) {
      const leftSidebar = document.getElementById('sidebar-scroll-left');
      const layerDomItem = document.getElementById(selected[0]);
      if (layerDomItem) {
        gsap.set(leftSidebar, {
          scrollTo: layerDomItem
        });
      }
    }
  }, [search])

  const debounceSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
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
      setSearchActive(false);
    }
    setFocused(false);
  }

  const handleSearchFocus = () => {
    if (!searchActive) {
      setSearchActive(true);
    }
    setFocused(true);
  }

  const handleClearSearch = () => {
    setInputValue('');
    debounceSearch('');
  }

  return (
    <div
      className='c-sidebar__search'
      style={{
        background: theme.name === 'dark' ? theme.background.z3 : theme.background.z0,
        boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`
      }}>
      <div className='c-sidebar-search__icon'>
        <Icon
          name='search'
          small
          style={{
            fill: focused ? theme.palette.primary : theme.text.lighter
          }} />
      </div>
      <div
        className='c-sidebar-search__input'>
        <SidebarInput
          value={inputValue}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
          submitOnBlur
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

const mapStateToProps = (state: RootState): {
  selected: string[];
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  return { selected };
};

export default connect(
  mapStateToProps
)(SidebarLayersSearch);