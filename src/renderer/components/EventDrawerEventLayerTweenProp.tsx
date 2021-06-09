import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { titleCase } from '../utils';
import { selectLayerEventTweens, deselectLayerEventTweens } from '../store/actions/layer';
import { setEventDrawerTweenHoverThunk } from '../store/actions/eventDrawer';
import EventDrawerEventEditEase from './EventDrawerEventEditEase';
import Icon from './Icon';
import ListItem from './ListItem';
import IconButton from './IconButton';

interface EventDrawerEventLayerTweenPropProps {
  tweenId: string;
}

const EventDrawerEventLayerTweenProp = (props: EventDrawerEventLayerTweenPropProps): ReactElement => {
  const { tweenId } = props;
  const instanceId = useSelector((state: RootState) => state.session.instance);
  const tweenProp = useSelector((state: RootState) => titleCase(state.layer.present.tweens.byId[tweenId].prop));
  const selectedWiggles = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds.filter((id) => state.layer.present.tweens.byId[id].ease === 'customWiggle'));
  const isWiggle = useSelector((state: RootState) => state.layer.present.tweens.byId[tweenId].ease === 'customWiggle');
  const tweenHover = useSelector((state: RootState) => state.eventDrawer.tweenHover);
  const isSelected = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds.includes(tweenId));
  const dispatch = useDispatch();

  const handleMouseEnter = (): void => {
    dispatch(setEventDrawerTweenHoverThunk({
      id: tweenId
    }));
  }

  const handleMouseLeave = (): void => {
    dispatch(setEventDrawerTweenHoverThunk({
      id: null
    }));
  }

  const handleMouseDown = (e: any): void => {
    if (e.metaKey) {
      if (isSelected) {
        dispatch(deselectLayerEventTweens({
          tweens: [tweenId]
        }));
      } else {
        dispatch(selectLayerEventTweens({
          tweens: [tweenId],
          handle: { [tweenId]: 'delay' }
        }));
      }
    } else {
      if (!isSelected) {
        dispatch(selectLayerEventTweens({
          tweens: [tweenId],
          handle: { [tweenId]: 'delay' },
          newSelection: true
        }));
      }
    }
  }

  const handleContextMenu = () => {
    (window as any).api.openTweenContextMenu(JSON.stringify({
      instanceId,
      template: [{
        label: `Edit...`,
        click: {
          id: 'openEaseEditor',
          params: {
            tween: tweenId
          }
        }
      }, ...(
        selectedWiggles.length > 0
        ? [{
            label: `Remove ${selectedWiggles.length > 1 ? selectedWiggles.length + ' Wiggles' : 'Wiggle'}`,
            click: {
              id: 'removeLayerTweens',
              params: {
                tweens: selectedWiggles
              }
            }
          }]
        : []
      )]
    }));
  }

  return (
    <ListItem
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      isActive={isSelected}
      interactive
      hovering={tweenId === tweenHover}
      style={{
        cursor: 'pointer'
      }}>
      {
        tweenId === tweenHover
        ? <EventDrawerEventEditEase
            tweenId={tweenId} />
        : <Icon />
      }
      <ListItem.Body>
        <ListItem.Text
          size='small'>
          { tweenProp }
        </ListItem.Text>
      </ListItem.Body>
      {
        isWiggle
        ? <ListItem.Right>
            <IconButton
              iconName='ease-customWiggle-out'
              onClick={handleContextMenu}
              size='small' />
          </ListItem.Right>
        : null
      }
    </ListItem>
  );
}

export default EventDrawerEventLayerTweenProp;