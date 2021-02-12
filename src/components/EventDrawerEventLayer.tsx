import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerHover } from '../store/actions/layer';
import EventDrawerEventTweenProps from './EventDrawerEventLayerTweenProps';
import SidebarLayerIcon from './SidebarLayerIcon';
import ListItem from './ListItem';

interface EventDrawerEventLayerProps {
  id: string;
}

const EventDrawerEventLayer = ({ id }: EventDrawerEventLayerProps): ReactElement => {
  const layerName = useSelector((state: RootState) => state.layer.present.byId[id].name);
  const tweenEditing = useSelector((state: RootState) => state.eventDrawer.tweenEditing);
  const dispatch = useDispatch();

  const handleMouseEnter = (): void => {
    if (!tweenEditing) {
      dispatch(setLayerHover({ id }));
    }
  }

  const handleMouseLeave = (): void => {
    if (!tweenEditing) {
      dispatch(setLayerHover({ id: null }));
    }
  }

  return (
    <>
      <ListItem
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        flush
        root>
        <SidebarLayerIcon
          id={id}
          isDragGhost />
        <ListItem.Body>
          <ListItem.Text size='small'>
            { layerName }
          </ListItem.Text>
        </ListItem.Body>
      </ListItem>
      <EventDrawerEventTweenProps layerId={id} />
    </>
  );
}

export default EventDrawerEventLayer;