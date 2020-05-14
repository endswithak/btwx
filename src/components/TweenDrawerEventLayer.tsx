import React, { useContext, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import TweenDrawerEventLayerTweens from './TweenDrawerEventLayerTweens';
import { setLayerHover } from '../store/actions/layer';
import { SetLayerHoverPayload, LayerTypes } from '../store/actionTypes/layer';

interface TweenDrawerEventLayerProps {
  id: string;
  layer?: em.Layer;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
}

const TweenDrawerEventLayer = (props: TweenDrawerEventLayerProps): ReactElement => {
  const [hover, setHover] = useState(false);
  const theme = useContext(ThemeContext);
  const { id, layer, setLayerHover } = props;

  const handleMouseEnter = () => {
    setHover(true);
    setLayerHover({ id });
  }

  const handleMouseLeave = () => {
    setHover(false);
    setLayerHover({ id });
  }

  return (
    <div
      className={`c-tween-drawer-event__layer`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <div
        className={`c-tween-drawer-event-layer__tween`}
        style={{
          color: theme.text.base
        }}>
        {layer.name}
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
  { setLayerHover }
)(TweenDrawerEventLayer);