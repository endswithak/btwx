import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import EmptyState from './EmptyState';

interface SidebarLeftSearchEmptyStateProps {
  search?: string;
}

const SidebarLeftSearchEmptyState = (props: SidebarLeftSearchEmptyStateProps): ReactElement => {
  const { search } = props;

  return (
    <EmptyState
      icon='search'
      text='No Layers Found'
      detail={`Could not find any layers matching "${search}"`}
      style={{width: 211}} />
  );
}

const mapStateToProps = (state: RootState): {
  search: string;
} => {
  const { leftSidebar } = state;
  const search = leftSidebar.search;
  return { search };
};

export default connect(
  mapStateToProps
)(SidebarLeftSearchEmptyState);