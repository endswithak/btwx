import React, { ReactElement } from 'react';
import SidebarEmptyState from './SidebarEmptyState';

interface SidebarLeftSearchEmptyStateProps {
  searchText: string;
}

const SidebarLeftSearchEmptyState = (props: SidebarLeftSearchEmptyStateProps): ReactElement => {
  const { searchText } = props;

  return (
    <SidebarEmptyState
      icon='search'
      text='No Layers Found'
      detail={`Could not find any layers matching "${searchText}"`}
      style={{width: 211}} />
  );
}

export default SidebarLeftSearchEmptyState;