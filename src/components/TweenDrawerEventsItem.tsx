import React, { useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setTweenDrawerEventThunk, setTweenDrawerEventHoverThunk } from '../store/actions/tweenDrawer';
import { setLayerHover, setActiveArtboard } from '../store/actions/layer';
import { openContextMenu } from '../store/actions/contextMenu';
import { DEFAULT_TWEEN_EVENTS } from '../constants';
import { ThemeContext } from './ThemeProvider';
import TweenDrawerEventsItemEdit from './TweenDrawerEventsItemEdit';
import TweenDrawerEventsItemRemove from './TweenDrawerEventsItemRemove';
import SidebarLayerIcon from './SidebarLayerIcon';

interface TweenDrawerEventItemProps {
  id: string;
}

interface ItemProps {
  hovering: boolean;
}

const Item = styled.div<ItemProps>`
  color: ${props => props.theme.text.base};
  box-shadow: ${props => props.hovering ? `0 0 0 1px ${props.theme.palette.primary} inset` : 'none'};
  cursor: pointer;
`;

const TweenDrawerEventItem = (props: TweenDrawerEventItemProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { id } = props;
  const activeArtboard = useSelector((state: RootState) => state.layer.present.activeArtboard);
  const tweenEvent = useSelector((state: RootState) => state.layer.present.events.byId[id]);
  const artboard = useSelector((state: RootState) => state.layer.present.byId[tweenEvent.artboard]);
  const artboardName = artboard.name;
  const layerItem = useSelector((state: RootState) => state.layer.present.byId[tweenEvent.layer]);
  const destination = useSelector((state: RootState) => state.layer.present.byId[tweenEvent.destinationArtboard]);
  const destinationName = destination.name;
  const tweenEventDisplayName = DEFAULT_TWEEN_EVENTS.find((defaultEvent) => defaultEvent.event === tweenEvent.event).titleCase;
  const hovering = useSelector((state: RootState) => state.tweenDrawer.eventHover === id);
  const dispatch = useDispatch();

  const handleMouseEnter = (): void => {
    // if (activeArtboard !== tweenEvent.artboard) {
    //   setActiveArtboard({id: tweenEvent.artboard});
    // }
    dispatch(setTweenDrawerEventHoverThunk({id}));
  }

  const handleMouseLeave = (): void => {
    dispatch(setTweenDrawerEventHoverThunk({id: null}));
  }

  const handleDoubleClick = (e: any): void => {
    // ignore clicks on edit / remove buttons
    if (e.target.nodeName !== 'path' && e.target.nodeName !== 'svg') {
      dispatch(setTweenDrawerEventThunk({id}));
      dispatch(setLayerHover({id: null}));
    }
  }

  const handleContextMenu = (e: any): void => {
    dispatch(openContextMenu({
      type: 'TweenDrawerEvent',
      id: id,
      x: e.clientX,
      y: e.clientY,
      paperX: e.clientX,
      paperY: e.clientY
    }));
  }

  return (
    <Item
      className='c-tween-drawer-events__item'
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
      theme={theme}
      hovering={hovering}>
      <div className='c-tween-drawer-events-item__module'>
        <SidebarLayerIcon
          id={layerItem.id}
          isDragGhost />
        <span style={{marginLeft: 8}}>
          {layerItem.name}
        </span>
      </div>
      <div className='c-tween-drawer-events-item__module'>
        <span>{tweenEventDisplayName}</span>
      </div>
      <div className='c-tween-drawer-events-item__module'>
        <span>{artboardName}</span>
      </div>
      <div className='c-tween-drawer-events-item__module'>
        <span>{destinationName}</span>
      </div>
      <div className='c-tween-drawer-events-item__module'>
        <TweenDrawerEventsItemEdit id={id} />
        <TweenDrawerEventsItemRemove id={id} />
      </div>
    </Item>
  );
}

export default TweenDrawerEventItem;