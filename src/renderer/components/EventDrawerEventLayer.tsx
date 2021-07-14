import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerHover } from '../store/actions/layer';
import { getPossibleProps } from '../store/selectors/layer';
import { titleCase } from '../utils';
import { getDefaultTweenProps } from '../constants';
import EventDrawerEventTweenProps from './EventDrawerEventLayerTweenProps';
import SidebarLayerIcon from './SidebarLayerIcon';
import IconButton from './IconButton';
import ListItem from './ListItem';

interface EventDrawerEventLayerProps {
  id: string;
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

const EventDrawerEventLayer = ({ id, equivalentId, equivalentTweenProps, eventId, group }: EventDrawerEventLayerProps): ReactElement => {
  const instanceId = useSelector((state: RootState) => state.session.instance);
  const layerItem = useSelector((state: RootState) => state.layer.present.byId[id]);
  const equivalentLayerItem = useSelector((state: RootState) => state.layer.present.byId[equivalentId]);
  const tweenEditing = useSelector((state: RootState) => state.eventDrawer.tweenEditing);
  // const eventItem = useSelector((state: RootState) => state.layer.present.events.byId[eventId]);
  const dispatch = useDispatch();

  const buildSubMenu = () => {
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
          // const tweensByProp = layerItem.tweens.byProp[current];
          // if (eventItem.tweens.allIds.every((id) => !tweensByProp.includes(id)) && possibleProps.includes(current)) {
          //   result = [...result, {
          //     label: titleCase(current),
          //     click: {
          //       id: 'addLayerTween',
          //       params: {
          //         ...getDefaultTweenProps(current),
          //         layer: id,
          //         destinationLayer: equivalentLayerItem.id,
          //         prop: current,
          //         event: eventId,
          //         ease: 'customWiggle'
          //       }
          //     }
          //   }];
          // }
          if (equivalentTweenProps[current]) {
            result = [...result, {
              label: titleCase(current),
              click: {
                id: 'addLayerTween',
                params: {
                  ...getDefaultTweenProps(current),
                  layer: id,
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

  const handleMouseEnter = (): void => {
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
    <>
      <ListItem
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onContextMenu={handleContextMenu}
        flush
        root>
        <SidebarLayerIcon
          id={id}
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
      <EventDrawerEventTweenProps
        layerId={id} />
    </>
  );
}

export default EventDrawerEventLayer;