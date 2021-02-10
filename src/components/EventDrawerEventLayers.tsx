import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollSyncPane } from 'react-scroll-sync';
import { RootState } from '../store/reducers';
import { getTweenEventLayers } from '../store/selectors/layer';
import { setEventDrawerEventThunk } from '../store/actions/eventDrawer';
import { setLayerHover } from '../store/actions/layer';
import EventDrawerEventLayer from './EventDrawerEventLayer';
import EventDrawerEventLayersEmptyState from './EventDrawerEventLayersEmptyState';
import EventDrawerStickyHeader from './EventDrawerStickyHeader';
import IconButton from './IconButton';
import ListItem from './ListItem';

interface EventDrawerEventLayersProps {
  scrollLayer: string;
}

const EventDrawerEventLayers = (props: EventDrawerEventLayersProps): ReactElement => {
  const { scrollLayer } = props;
  const eventLayers = useSelector((state: RootState) => getTweenEventLayers(state.layer.present, state.eventDrawer.event));
  const isEmpty = eventLayers.allIds.length === 0;
  const eventItem = useSelector((state: RootState) => state.layer.present.events.byId[state.eventDrawer.event]);
  const artboardItem = useSelector((state: RootState) => state.layer.present.byId[eventItem.artboard]);
  const eventDrawerEventLayersWidth = useSelector((state: RootState) => state.viewSettings.eventDrawer.layersWidth);
  const tweenEditing = useSelector((state: RootState) => state.eventDrawer.tweenEditing);
  const dispatch = useDispatch();

  const handleMouseEnter = (id: string): void => {
    if (!tweenEditing) {
      dispatch(setLayerHover({id}));
    }
  }

  const handleMouseLeave = (): void => {
    if (!tweenEditing) {
      dispatch(setLayerHover({id: null}));
    }
  }

  // const handleClick = (id: string): void => {
  //   dispatch(selectLayers({layers: [id], newSelection: true}));
  // }

  return (
    <div
      id='event-layers'
      className='c-event-drawer-event__layers'
      style={{
        width: eventDrawerEventLayersWidth
      }}>
      <ListItem
        as='div'
        onMouseEnter={(): void => handleMouseEnter(artboardItem.id)}
        onMouseLeave={handleMouseLeave}
        flushWithPadding
        root>
        <IconButton
          iconName='thicc-chevron-left'
          size='small'
          onClick={() => dispatch(setEventDrawerEventThunk({id: null}))} />
        <ListItem.Body>
          <ListItem.Text size='small'>
            { artboardItem.name }
          </ListItem.Text>
        </ListItem.Body>
      </ListItem>
      {
        isEmpty
        ? <EventDrawerEventLayersEmptyState />
        : <>
            <EventDrawerStickyHeader
              scrollLayer={scrollLayer} />
            <ScrollSyncPane>
              <div
                id='event-drawer-event-layers'
                className='c-event-drawer-event-layers__layers'>
                {
                  eventLayers.allIds.map((layer, index) => (
                    <EventDrawerEventLayer
                      key={index}
                      id={layer}
                      index={index} />
                  ))
                }
              </div>
            </ScrollSyncPane>
          </>
      }
    </div>
  );
}

export default EventDrawerEventLayers;