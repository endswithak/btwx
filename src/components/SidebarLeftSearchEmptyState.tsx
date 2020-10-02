import React, { ReactElement } from 'react';
import EmptyState from './EmptyState';

interface SidebarLeftSearchEmptyStateProps {
  searchText: string;
}

const SidebarLeftSearchEmptyState = (props: SidebarLeftSearchEmptyStateProps): ReactElement => {
  const { searchText } = props;

  return (
    <EmptyState
      icon='search'
      text='No Layers Found'
      detail={`Could not find any layers matching "${searchText}"`}
      style={{width: 211}} />
  );
}

export default SidebarLeftSearchEmptyState;