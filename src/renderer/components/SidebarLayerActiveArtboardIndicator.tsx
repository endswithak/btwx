import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import Icon from './Icon';
import ListItem from './ListItem';

interface SidebarLayerActiveArtboardIndicatorProps {
  id: string;
  isDragGhost?: boolean;
  isSelected?: boolean;
}

const SidebarLayerActiveArtboardIndicator = (props: SidebarLayerActiveArtboardIndicatorProps): ReactElement => {
  const { id, isDragGhost } = props;
  const isActiveArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard === id);
  const isSelected = useSelector((state: RootState) => state.layer.present.byId[id] && state.layer.present.byId[id].selected);
  const selected = typeof props.isSelected === 'boolean' ? props.isSelected : isSelected;

  return (
    isActiveArtboard && !isDragGhost
    ? <ListItem.Right>
        <div
          className='c-sidebar-layer__icon'>
          <Icon
            size='small'
            name='active-artboard-badge'
            variant={selected ? 'base-on-primary' : 'primary'} />
        </div>
      </ListItem.Right>
    : null
  );
}

export default SidebarLayerActiveArtboardIndicator;