import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerHover } from '../store/actions/layer';
import { getPossibleProps } from '../store/selectors/layer';
import { titleCase } from '../utils';
import { getDefaultTweenProps } from '../constants';
import ListItem from './ListItem';
import SidebarLayerIcon from './SidebarLayerIcon';
import IconButton from './IconButton';

interface EventDrawerStickyHeaderProps {
  scrollLayer: string;
  equivalentId: string;
  equivalentTweenProps: any;
  eventId: string;
  group?: {
    allIds: string[];
    byId: {
      [id: string]: Btwx.Layer;
    };
    byProp: {
      [K in Btwx.TweenProp]: string[];
    };
    map: {
      [id: string]: string;
    };
    propsMap: {
      [id: string]: Btwx.TweenProp[];
    };
    equivalent: {
      allIds: string[];
      byId: {
        [id: string]: Btwx.Layer;
      };
    };
  };
}

const EventDrawerStickyHeader = (props: EventDrawerStickyHeaderProps): ReactElement => {
  const { scrollLayer, equivalentId, equivalentTweenProps, eventId, group } = props;
  const instanceId = useSelector((state: RootState) => state.session.instance);
  const layerItem = useSelector((state: RootState) => scrollLayer ? state.layer.present.byId[scrollLayer] : null);
  const equivalentLayerItem = useSelector((state: RootState) => state.layer.present.byId[equivalentId]);
  const tweenEditing = useSelector((state: RootState) => state.eventDrawer.tweenEditing);
  // const eventItem = useSelector((state: RootState) => state.layer.present.events.byId[eventId]);
  const dispatch = useDispatch();

  const buildSubMenu = () => {
    // if (layerItem && equivalentLayerItem) {
    //   const possibleProps = getPossibleProps(layerItem, equivalentLayerItem);
    //   return (Object.keys(equivalentTweenProps) as Btwx.TweenProp[]).reduce((result, current) => {
    //     const tweensByProp = layerItem.tweens.byProp[current];
    //     if (eventItem.tweens.allIds.every((id) => !tweensByProp.includes(id)) && possibleProps.includes(current)) {
    //       result = [...result, {
    //         label: titleCase(current),
    //         click: {
    //           id: 'addLayerTween',
    //           params: {
    //             ...getDefaultTweenProps(current),
    //             layer: scrollLayer,
    //             destinationLayer: equivalentLayerItem.id,
    //             prop: current,
    //             event: eventId,
    //             ease: 'customWiggle',
    //           }
    //         }
    //       }];
    //     }
    //     return result;
    //   }, []);
    // } else {
    //   return [];
    // }
    if ((layerItem && equivalentLayerItem) || (group && group.allIds.length > 0)) {
      if (group) {
        return (Object.keys(group.byProp) as Btwx.TweenProp[]).reduce((result, current) => {
          if (group.byProp[current].length > 0) {
            result = [...result, {
              label: titleCase(current),
              click: {
                id: 'addGroupWiggles',
                params: {
                  layers: group.byProp[current],
                  byLayer: group.byProp[current].reduce((r, c) => {
                    r = {
                      ...r,
                      [c]: {
                        ...getDefaultTweenProps(current),
                        layer: c,
                        destinationLayer: group.map[c],
                        prop: current,
                        event: eventId,
                        ease: 'customWiggle'
                      }
                    }
                    return r;
                  }, {})
                }
              }
            }];
          }
          return result;
        }, []);
      } else {
        // const possibleProps = getPossibleProps(layerItem, equivalentLayerItem);
        return (Object.keys(equivalentTweenProps) as Btwx.TweenProp[]).reduce((result, current) => {
          if (equivalentTweenProps[current]) {
            result = [...result, {
              label: titleCase(current),
              click: {
                id: 'addLayerTween',
                params: {
                  ...getDefaultTweenProps(current),
                  layer: scrollLayer,
                  destinationLayer: equivalentLayerItem.id,
                  prop: current,
                  event: eventId,
                  ease: 'customWiggle'
                }
              }
            }];
          }
          return result;
        }, []);
      }
    } else {
      return [];
    }
  }

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

  const handleContextMenu = (): void => {
    (window as any).api.openTweenLayerContextMenu(JSON.stringify({
      instanceId,
      template: [{
        label: 'Add Wiggle...',
        submenu: buildSubMenu()
      }]
    }));
  }

  return (
    layerItem
    ? <div className='c-event-drawer-sticky-header'>
        <ListItem
          as='div'
          onMouseEnter={(): void => handleMouseEnter(layerItem.id)}
          onMouseLeave={handleMouseLeave}
          onContextMenu={handleContextMenu}
          flush
          root>
          <SidebarLayerIcon
            id={layerItem.id}
            isDragGhost />
          <ListItem.Body>
            <ListItem.Text
              size='small'
              style={{
                fontWeight: 400
              }}>
              { layerItem.name }
            </ListItem.Text>
          </ListItem.Body>
          <ListItem.Right>
            <IconButton
              iconName='ease-customWiggle-out'
              onClick={handleContextMenu}
              size='small' />
          </ListItem.Right>
        </ListItem>
      </div>
    : null
  );
}

export default EventDrawerStickyHeader;