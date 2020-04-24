import React, { useContext, ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { expandGroup, collapseGroup } from '../store/actions/layers';
import { ThemeContext } from './ThemeProvider';
import { ShowChildrenPayload, LayersTypes } from '../store/actionTypes/layers';

interface SidebarLayerChevronProps {
  layer: em.Layer;
  expandGroup(payload: ShowChildrenPayload): LayersTypes;
  collapseGroup(payload: ShowChildrenPayload): LayersTypes;
}

const SidebarLayerChevron = (props: SidebarLayerChevronProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { layer, expandGroup, collapseGroup } = props;

  const handleChevronClick = (): void => {
    if (layer.type === 'Group') {
      if ((layer as em.Group).expanded) {
        collapseGroup({id: layer.id});
      } else {
        expandGroup({id: layer.id});
      }
    }
  }

  return (
    layer.type === 'Group'
    ? <div
        className='c-sidebar-layer__chevron'
        onClick={handleChevronClick}
        >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{
            fill: layer.selected
            ? theme.text.onPrimary
            : theme.text.lighter
          }}>
          {
            (layer as em.Group).expanded
            ? <path d="M7 10l5 5 5-5H7z"/>
            : <path d='M10 17l5-5-5-5v10z' />
          }
        </svg>
      </div>
    : <div className='c-sidebar-layer__chevron' />
  );
}

export default connect(
  null,
  { expandGroup, collapseGroup }
)(SidebarLayerChevron);