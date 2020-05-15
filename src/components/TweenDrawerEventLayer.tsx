import React, { useContext, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import TweenDrawerEventLayerTweens from './TweenDrawerEventLayerTweens';
import { setLayerHover, selectLayer } from '../store/actions/layer';
import { SetLayerHoverPayload, SelectLayerPayload, LayerTypes } from '../store/actionTypes/layer';

interface TweenDrawerEventLayerProps {
  id: string;
  index: number;
  layer?: em.Layer;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  selectLayer?(payload: SelectLayerPayload): LayerTypes;
}

const TweenDrawerEventLayer = (props: TweenDrawerEventLayerProps): ReactElement => {
  const [hover, setHover] = useState(false);
  const theme = useContext(ThemeContext);
  const { id, index, layer, setLayerHover, selectLayer } = props;

  const handleMouseEnter = () => {
    setHover(true);
    setLayerHover({ id });
  }

  const handleMouseLeave = () => {
    setHover(false);
    setLayerHover({ id: null });
  }

  const handleClick = () => {
    selectLayer({id: id, newSelection: true});
  }

  return (
    <div
      className={`c-tween-drawer-event__layer`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}>
      <div
        className={`c-tween-drawer-event-layer__tween`}
        style={{
          background: layer.selected
          ? theme.palette.primary
          : 'none',
          cursor: 'pointer'
        }}>
        <div className='c-tween-drawer__icon'>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{
              fill: layer.selected
              ? theme.text.onPrimary
              : theme.text.lighter
            }}>
            {
              (layer as em.Group).showTweens
              ? <path d="M7 10l5 5 5-5H7z"/>
              : <path d='M10 17l5-5-5-5v10z' />
            }
          </svg>
        </div>
        <div
          className='c-tween-drawer-event-layer-tween__name'
          style={{
            color: theme.text.base,
          }}>
          {layer.name}
        </div>
        <div className='c-tween-drawer__icon'>
          <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{
            fill: layer.selected
            ? layer.frozen
              ? theme.text.onPrimary
              : theme.text.lighter
            : theme.text.lighter
          }}>
            <path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z"/>
          </svg>
        </div>
      </div>
      <TweenDrawerEventLayerTweens layerId={id} />
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: TweenDrawerEventLayerProps) => {
  const { layer } = state;
  return { layer: layer.present.byId[ownProps.id] };
};

export default connect(
  mapStateToProps,
  { setLayerHover, selectLayer }
)(TweenDrawerEventLayer);