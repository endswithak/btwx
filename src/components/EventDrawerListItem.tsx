import React, { ReactElement, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setEventDrawerEventThunk, setEventDrawerEventHoverThunk } from '../store/actions/eventDrawer';
import { setLayerHover, setActiveArtboard } from '../store/actions/layer';
import { openContextMenu } from '../store/actions/contextMenu';
import { DEFAULT_TWEEN_EVENTS } from '../constants';
import EventDrawerListItemEdit from './EventDrawerListItemEdit';
import EventDrawerListItemRemove from './EventDrawerListItemRemove';
import SidebarLayerIcon from './SidebarLayerIcon';
import ListItem from './ListItem';
import ListGroup from './ListGroup';

interface EventDrawerListItemProps {
  id: string;
}

const EventDrawerListItem = (props: EventDrawerListItemProps): ReactElement => {
  const actionsContainerRef = useRef(null);
  const { id } = props;
  // const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const tweenEvent = useSelector((state: RootState) => state.layer.present.events.byId[id]);
  const artboard = useSelector((state: RootState) => state.layer.present.byId[tweenEvent.artboard]);
  const artboardName = artboard.name;
  const layerItem = useSelector((state: RootState) => state.layer.present.byId[tweenEvent.layer]);
  const destination = useSelector((state: RootState) => state.layer.present.byId[tweenEvent.destinationArtboard]);
  const destinationName = destination.name;
  const tweenEventDisplayName = DEFAULT_TWEEN_EVENTS.find((defaultEvent) => defaultEvent.event === tweenEvent.event).titleCase;
  const hovering = useSelector((state: RootState) => state.eventDrawer.eventHover === id);
  const dispatch = useDispatch();

  const handleMouseEnter = (): void => {
    // if (activeArtboard !== tweenEvent.artboard) {
    //   setActiveArtboard({id: tweenEvent.artboard});
    // }
    dispatch(setEventDrawerEventHoverThunk({id}));
  }

  const handleMouseLeave = (): void => {
    dispatch(setEventDrawerEventHoverThunk({id: null}));
  }

  const handleDoubleClick = (e: any): void => {
    // ignore clicks on edit / remove buttons
    if (!actionsContainerRef.current.contains(e.target)) {
      dispatch(setEventDrawerEventThunk({id}));
      dispatch(setLayerHover({id: null}));
    }
  }

  const handleContextMenu = (e: any): void => {
    dispatch(openContextMenu({
      type: 'EventDrawerEvent',
      id: id,
      x: e.clientX,
      y: e.clientY,
      paperX: e.clientX,
      paperY: e.clientY
    }));
  }

  return (
    <ListItem
      interactive
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}>
      <ListGroup horizontal>
        <ListItem
          flush
          style={{
            width: '25%'
          }}>
          <SidebarLayerIcon
            id={layerItem.id}
            isDragGhost />
          <ListItem.Body>
            <ListItem.Text size='small'>
              {layerItem.name}
            </ListItem.Text>
          </ListItem.Body>
        </ListItem>
        <ListItem
          flush
          style={{
            width: '25%'
          }}>
          <ListItem.Body>
            <ListItem.Text size='small'>
              { tweenEventDisplayName }
            </ListItem.Text>
          </ListItem.Body>
        </ListItem>
        <ListItem
          flush
          style={{
            width: '25%'
          }}>
          <ListItem.Body>
            <ListItem.Text size='small'>
              { artboardName }
            </ListItem.Text>
          </ListItem.Body>
        </ListItem>
        <ListItem
          flush
          style={{
            width: '25%'
          }}>
          <ListItem.Body>
            <ListItem.Text size='small'>
              { destinationName }
            </ListItem.Text>
          </ListItem.Body>
        </ListItem>
        <ListItem
          ref={actionsContainerRef}
          flush
          style={{
            width: '25%'
          }}>
          <EventDrawerListItemEdit id={id} />
          <EventDrawerListItemRemove id={id} />
        </ListItem>
      </ListGroup>
    </ListItem>
  );
}

export default EventDrawerListItem;