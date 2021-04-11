import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import EmptyState from './EmptyState';

const SidebarLeftSearchEmptyState = (): ReactElement => {
  const search = useSelector((state: RootState) => state.leftSidebar.search);

  return (
    <EmptyState
      icon='search'
      text='No Layers Found'
      detail={`Could not find any layers matching "${search}"`}
      style={{width: 211}} />
  );
}

export default SidebarLeftSearchEmptyState;