import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface TweenDrawerEventLayersProps {
  text?: string;
  icon?: string;
  layerItem?: em.Layer;
  sticky?: boolean;
  onMouseEnter?(): void;
  onMouseLeave?(): void;
  onClick?(): void;
  onIconClick?(): void;
}

const TweenDrawerEventLayersHeader = (props: TweenDrawerEventLayersProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { text, icon, onMouseEnter, onMouseLeave, onClick, onIconClick, sticky, layerItem } = props;

  return (
    <div
      className={`c-tween-drawer-event-layers__header ${sticky ? 'c-tween-drawer-event-layers__header--sticky' : null}`}
      style={{
        background: sticky ? (theme.name === 'dark' ? theme.background.z2 : theme.background.z1) : (theme.name === 'dark' ? theme.background.z3 : theme.background.z0),
        boxShadow: `0 -1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`
      }}>
      <button
        className='c-tween-drawer-event-layer__tween'
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          boxShadow: sticky ? `-1px 0 0 0 ${theme.background.z5} inset` : 'none'
        }}>
        <div
          className='c-tween-drawer-event-layer__icon'
          onClick={onIconClick}>
          <Icon
            name={icon}
            shapeId={layerItem ? layerItem.id : null}
            small
            style={{
              fill: theme.text.lighter,
              stroke: layerItem && layerItem.type === 'Shape' && !(layerItem as em.Shape).path.closed
              ? theme.text.lighter
              : 'none',
              strokeWidth: 1
            }} />
        </div>
        <div
          className='c-tween-drawer-event-layer-tween__name'
          style={{
            color: sticky ? theme.text.base : theme.text.lighter,
            textTransform: sticky ? 'none' : 'uppercase'
          }}>
          { text }
        </div>
      </button>
    </div>
  );
}

export default TweenDrawerEventLayersHeader;