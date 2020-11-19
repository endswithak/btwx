import React, { useContext, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ScrollSyncPane } from 'react-scroll-sync';
import { RootState } from '../store/reducers';
import { getTweenEventLayers } from '../store/selectors/layer';
import { setTweenDrawerEventThunk } from '../store/actions/tweenDrawer';
import { SetTweenDrawerEventPayload } from '../store/actionTypes/tweenDrawer';
import { setLayerHover, selectLayers } from '../store/actions/layer';
import { SetLayerHoverPayload, SelectLayersPayload, LayerTypes } from '../store/actionTypes/layer';
import { ThemeContext } from './ThemeProvider';
import TweenDrawerEventLayer from './TweenDrawerEventLayer';
import TweenDrawerEventLayersHeader from './TweenDrawerEventLayersHeader';
import EmptyState from './EmptyState';

interface TweenDrawerEventLayersProps {
  isEmpty?: boolean;
  tweenDrawerLayersWidth?: number;
  artboardItem?: Btwx.Artboard;
  tweenEventLayers?: {
    allIds: string[];
    byId: {
      [id: string]: Btwx.Layer;
    };
  };
  scrollLayerItem?: Btwx.Layer;
  scrollLayer: string;
  setTweenDrawerEventThunk?(payload: SetTweenDrawerEventPayload): void;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  selectLayers?(payload: SelectLayersPayload): LayerTypes;
}

const TweenDrawerEventLayers = (props: TweenDrawerEventLayersProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isEmpty, scrollLayer, scrollLayerItem, tweenDrawerLayersWidth, tweenEventLayers, setTweenDrawerEventThunk, artboardItem, setLayerHover, selectLayers } = props;

  const handleMouseEnter = (id: string) => {
    setLayerHover({id: id});
  }

  const handleMouseLeave = () => {
    setLayerHover({id: null});
  }

  const handleClick = (id: string) => {
    selectLayers({layers: [id], newSelection: true});
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
        onIconClick={() => setTweenDrawerEventThunk({id: null})} />
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

const mapStateToProps = (state: RootState, ownProps: TweenDrawerEventLayersProps) => {
  const { layer, tweenDrawer, viewSettings } = state;
  const tweenEventLayers = getTweenEventLayers(layer.present, tweenDrawer.event);
  const isEmpty = tweenEventLayers.allIds.length === 0;
  const eventItem = layer.present.events.byId[tweenDrawer.event];
  const artboardItem = layer.present.byId[eventItem.artboard];
  const tweenDrawerLayersWidth = viewSettings.tweenDrawer.layersWidth;
  const scrollLayerItem = ownProps.scrollLayer ? layer.present.byId[ownProps.scrollLayer] : null;
  return { tweenEventLayers, artboardItem, tweenDrawerLayersWidth, scrollLayerItem, isEmpty };
};

export default connect(
  mapStateToProps,
  { setTweenDrawerEventThunk, setLayerHover, selectLayers }
)(TweenDrawerEventLayers);