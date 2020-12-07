import React, { useContext, ReactElement, useState } from 'react';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface TweenDrawerEventLayersProps {
  text?: string;
  icon?: {
    name?: string;
    shapeId?: string;
    small?: boolean;
    style?: any;
  };
  layerItem?: Btwx.Layer;
  maskItem?: Btwx.Layer;
  sticky?: boolean;
  onMouseEnter?(): void;
  onMouseLeave?(): void;
  onClick?(): void;
  onIconClick?(): void;
}

const TweenDrawerEventLayersHeader = (props: TweenDrawerEventLayersProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { text, icon, onMouseEnter, onMouseLeave, onClick, onIconClick, sticky, layerItem, maskItem } = props;
  const [hover, setHover] = useState(false);

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
          onClick={onIconClick}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}>
          <Icon
            name={icon.name}
            shapeId={icon.shapeId}
            small={icon.small}
            style={{
              fill: hover
              ? sticky
                ? theme.text.lighter
                : theme.text.base
              : theme.text.lighter,
              stroke: layerItem && layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType === 'Line'
              ? theme.text.lighter
              : 'none',
              strokeWidth: 1
            }} />
        </div>
        <div
          className='c-tween-drawer-event-layer-tween__name'
          style={{
            color: sticky ? theme.text.base : theme.text.lighter,
            textTransform: sticky ? 'none' : 'uppercase',
            fontWeight: sticky ? 400 : 700
          }}>
          { text }
        </div>
      </button>
    </div>
  );
}

export default TweenDrawerEventLayersHeader;