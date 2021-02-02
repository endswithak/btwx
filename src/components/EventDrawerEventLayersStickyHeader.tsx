import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerHover, selectLayers } from '../store/actions/layer';
import EventDrawerEventLayersHeader from './EventDrawerEventLayersHeader';

interface EventDrawerEventLayersProps {
  scrollLayer: string;
}

const EventDrawerEventLayers = (props: EventDrawerEventLayersProps): ReactElement => {
  const { scrollLayer } = props;
  const scrollLayerItem = useSelector((state: RootState) => scrollLayer ? state.layer.present.byId[scrollLayer] : null);
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
  //   dispatch(selectLayers({
  //     layers: [id],
  //     newSelection: true
  //   }));
  // }

  return (
    scrollLayerItem
    ? <EventDrawerEventLayersHeader
        text={scrollLayerItem.name}
        icon={{
          name: ((): string => {
            switch(scrollLayerItem.type) {
              case 'Artboard':
                return 'artboard'
              case 'Group':
                return 'folder';
              case 'Shape':
                return 'shape';
              case 'Text':
                return 'text';
              case 'Image':
                return 'image';
            }
          })(),
          small: scrollLayerItem.type === 'Shape',
          shapeId: scrollLayerItem.type === 'Shape'
          ? scrollLayerItem.id
          : null
        }}
        layerItem={scrollLayerItem}
        // onClick={(): void => handleClick(scrollLayerItem.id)}
        onMouseEnter={(): void => handleMouseEnter(scrollLayerItem.id)}
        onMouseLeave={handleMouseLeave}
        sticky />
    : null
  );
}

export default EventDrawerEventLayers;