import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollSyncPane } from 'react-scroll-sync';
import { RootState } from '../store/reducers';
import { getWiggleLayersSelector } from '../store/selectors/layer';
import { setEventDrawerEventThunk } from '../store/actions/eventDrawer';
import { setLayerHover } from '../store/actions/layer';
import EventDrawerEventLayer from './EventDrawerEventLayer';
import EventDrawerEventLayersEmptyState from './EventDrawerEventLayersEmptyState';
import EventDrawerStickyHeader from './EventDrawerStickyHeader';
import IconButton from './IconButton';
import ListItem from './ListItem';
import ListGroup from './ListGroup';
import EventDrawerEventClearSelection from './EventDrawerEventClearSelection';

interface EventDrawerEventLayersProps {
  scrollLayer: string;
}

const EventDrawerEventLayers = (props: EventDrawerEventLayersProps): ReactElement => {
  const { scrollLayer } = props;
  const eventLayers = useSelector((state: RootState) => state.layer.present.events.byId[state.eventDrawer.event] ? state.layer.present.events.byId[state.eventDrawer.event].layers : null);
  const wiggleLayers = useSelector((state: RootState) => getWiggleLayersSelector(state, state.eventDrawer.event));
  const eventItem = useSelector((state: RootState) => state.layer.present.events.byId[state.eventDrawer.event]);
  const artboardItem = useSelector((state: RootState) => state.layer.present.byId[eventItem.origin]);
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

  return (
    <div
      id='event-layers'
      className='c-event-drawer-event__layers'
      style={{
        width: eventDrawerEventLayersWidth
      }}>
      <EventDrawerEventClearSelection />
      <ListItem
        as='div'
        onMouseEnter={(): void => handleMouseEnter(artboardItem.id)}
        onMouseLeave={handleMouseLeave}
        flush
        root>
        <IconButton
          iconName='thicc-chevron-left'
          size='small'
          onClick={() => dispatch(setEventDrawerEventThunk({id: null}))}
          label='back' />
        <ListItem.Body>
          <ListItem.Text size='small'>
            { artboardItem.name }
          </ListItem.Text>
        </ListItem.Body>
      </ListItem>
      {
        eventLayers.length === 0 && wiggleLayers.allIds.length === 0
        ? <EventDrawerEventLayersEmptyState />
        : <>
            {
              eventLayers.length > 0
              ? <EventDrawerStickyHeader
                  scrollLayer={scrollLayer}
                  equivalentId={wiggleLayers.map[scrollLayer]}
                  equivalentTweenProps={wiggleLayers.propsMap[scrollLayer]}
                  eventId={eventItem.id} />
              : null
            }
            <ScrollSyncPane>
              <div
                id='event-drawer-event-layers'
                className='c-event-drawer-event-layers__layers'>
                <ListGroup>
                  {
                    eventLayers.map((layer) => (
                      <EventDrawerEventLayer
                        key={layer}
                        id={layer}
                        equivalentId={wiggleLayers.map[layer]}
                        equivalentTweenProps={wiggleLayers.propsMap[layer]}
                        eventId={eventItem.id} />
                    ))
                  }
                  {
                    wiggleLayers.allIds.filter((id) => !eventLayers.includes(id)).map((layer) => (
                      <EventDrawerEventLayer
                        key={layer}
                        id={layer}
                        equivalentId={wiggleLayers.map[layer]}
                        equivalentTweenProps={wiggleLayers.propsMap[layer]}
                        eventId={eventItem.id} />
                    ))
                  }
                </ListGroup>
              </div>
            </ScrollSyncPane>
          </>
      }
    </div>
  );
}

export default EventDrawerEventLayers;