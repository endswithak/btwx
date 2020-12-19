import React, { useContext, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollSyncPane } from 'react-scroll-sync';
import { RootState } from '../store/reducers';
import { getTweenEventLayers } from '../store/selectors/layer';
import { setEventDrawerEventThunk } from '../store/actions/eventDrawer';
import { setLayerHover, selectLayers } from '../store/actions/layer';
import { ThemeContext } from './ThemeProvider';
import EventDrawerEventLayer from './EventDrawerEventLayer';
import EventDrawerEventLayersHeader from './EventDrawerEventLayersHeader';
import EventDrawerEventLayersEmptyState from './EventDrawerEventLayersEmptyState';
import EventDrawerEventLayersStickyHeader from './EventDrawerEventLayersStickyHeader';

interface EventDrawerEventLayersProps {
  scrollLayer: string;
}

const EventDrawerEventLayers = (props: EventDrawerEventLayersProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { scrollLayer } = props;
  const eventLayers = useSelector((state: RootState) => getTweenEventLayers(state.layer.present, state.eventDrawer.event));
  const isEmpty = eventLayers.allIds.length === 0;
  const eventItem = useSelector((state: RootState) => state.layer.present.events.byId[state.eventDrawer.event]);
  const artboardItem = useSelector((state: RootState) => state.layer.present.byId[eventItem.artboard]);
  const eventDrawerEventLayersWidth = useSelector((state: RootState) => state.viewSettings.eventDrawer.layersWidth);
  const dispatch = useDispatch();

  const handleMouseEnter = (id: string): void => {
    dispatch(setLayerHover({id}));
  }

  const handleMouseLeave = (): void => {
    dispatch(setLayerHover({id: null}));
  }

  const handleClick = (id: string): void => {
    dispatch(selectLayers({layers: [id], newSelection: true}));
  }

  return (
    <div
      id='event-layers'
      className='c-event-drawer-event__layers'
      style={{
        boxShadow: `-1px 0 0 ${theme.name === 'dark'
        ? theme.background.z4
        : theme.background.z5} inset`,
        width: eventDrawerEventLayersWidth
      }}>
      <EventDrawerEventLayersHeader
        text={artboardItem.name}
        icon={{
          name: 'thicc-chevron-left',
          small: true
        }}
        onClick={(): void => handleClick(artboardItem.id)}
        onMouseEnter={(): void => handleMouseEnter(artboardItem.id)}
        onMouseLeave={handleMouseLeave}
        onIconClick={() => dispatch(setEventDrawerEventThunk({id: null}))} />
      {
        isEmpty
        ? <EventDrawerEventLayersEmptyState />
        : <>
            <EventDrawerEventLayersStickyHeader
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