import React, { useContext, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollSyncPane } from 'react-scroll-sync';
import { RootState } from '../store/reducers';
import { getTweenEventLayers } from '../store/selectors/layer';
import { setTweenDrawerEventThunk } from '../store/actions/tweenDrawer';
import { setLayerHover, selectLayers } from '../store/actions/layer';
import { ThemeContext } from './ThemeProvider';
import TweenDrawerEventLayer from './TweenDrawerEventLayer';
import TweenDrawerEventLayersHeader from './TweenDrawerEventLayersHeader';
import EmptyState from './EmptyState';

interface TweenDrawerEventLayersProps {
  scrollLayer: string;
}

const TweenDrawerEventLayers = (props: TweenDrawerEventLayersProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { scrollLayer } = props;
  const tweenEventLayers = useSelector((state: RootState) => getTweenEventLayers(state.layer.present, state.tweenDrawer.event));
  const isEmpty = tweenEventLayers.allIds.length === 0;
  const eventItem = useSelector((state: RootState) => state.layer.present.events.byId[state.tweenDrawer.event]);
  const artboardItem = useSelector((state: RootState) => state.layer.present.byId[eventItem.artboard]);
  const tweenDrawerLayersWidth = useSelector((state: RootState) => state.viewSettings.tweenDrawer.layersWidth);
  const scrollLayerItem = scrollLayer ? useSelector((state: RootState) => state.layer.present.byId[scrollLayer]) : null;
  const dispatch = useDispatch();

  const handleMouseEnter = (id: string) => {
    dispatch(setLayerHover({id}));
  }

  const handleMouseLeave = () => {
    dispatch(setLayerHover({id: null}));
  }

  const handleClick = (id: string) => {
    dispatch(selectLayers({layers: [id], newSelection: true}));
  }

  return (
    <div
      id='tween-layers'
      className='c-tween-drawer-event__layers'
      style={{
        boxShadow: `-1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`,
        width: tweenDrawerLayersWidth
      }}>
      <TweenDrawerEventLayersHeader
        text={artboardItem.name}
        icon={{
          name: 'thicc-chevron-left',
          small: true
        }}
        onClick={() => handleClick(artboardItem.id)}
        onMouseEnter={() => handleMouseEnter(artboardItem.id)}
        onMouseLeave={handleMouseLeave}
        onIconClick={() => dispatch(setTweenDrawerEventThunk({id: null}))} />
      {
        isEmpty
        ? <div style={{position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden'}}>
            <EmptyState
              icon='ease-curve'
              text='Event Layers'
              detail='View and edit event layer ease curves here.'
              style={{width: 211}} />
          </div>
        : <>
            {
              scrollLayer
              ? <TweenDrawerEventLayersHeader
                  text={scrollLayerItem.name}
                  icon={{
                    name: (() => {
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
                    shapeId: scrollLayerItem.type === 'Shape' ? scrollLayerItem.id : null
                  }}
                  layerItem={scrollLayerItem}
                  onClick={() => handleClick(scrollLayerItem.id)}
                  onMouseEnter={() => handleMouseEnter(scrollLayerItem.id)}
                  onMouseLeave={handleMouseLeave}
                  sticky />
              : null
            }
            <ScrollSyncPane>
              <div
                id='tween-drawer-event-layers'
                className='c-tween-drawer-event-layers__layers'>
                {
                  tweenEventLayers.allIds.map((layer, index) => (
                    <TweenDrawerEventLayer
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

export default TweenDrawerEventLayers;